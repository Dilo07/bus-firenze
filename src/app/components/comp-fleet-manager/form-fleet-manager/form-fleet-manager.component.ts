import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import CodiceFiscale from 'codice-fiscale-js';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { RegisterService } from 'src/app/services/register.service';
import { FleetManager } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModalOTPComponent } from '../register-page/modal-otp/modal-otp.component';
import parsePhoneNumber, { CountryCallingCode } from 'libphonenumber-js';

@Component({
  selector: 'app-form-fleet-manager',
  templateUrl: './form-fleet-manager.component.html',
  styleUrls: ['./form-fleet-manager.component.css']
})
export class FormFleetManagerComponent implements OnInit, OnDestroy {
  @Input() register = false;

  public data: FleetManager;
  public FormGroup: FormGroup;
  public verifyOtp = false;
  public dialCode: CountryCallingCode = '39';

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private fleetManagerService: FleetManagerService) {
    this.data = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data !== undefined && this.data !== null) {
      this.FormGroup = this.formBuilder.group({
        CtrlName: [this.data.name, Validators.required],
        CtrlSurname: [this.data.surname, Validators.required],
        CtrlCF: [this.data.fiscalCode, [this.fiscaleCodeValidator]],
        CtrlpIva: [this.data.pIva, Validators.required],
        CtrlCompanyName: [this.data.companyName, Validators.required],
        CtrlCell: [this.findContactValue(1), Validators.required],
        CtrlOffice: [this.findContactValue(2)],
        CtrlMail: [this.findContactValue(3), Validators.email],
        CtrlAddress: [this.data.address, Validators.required],
        CtrlCity: [this.data.city, Validators.required],
        CtrlDistrict: [this.data.district, Validators.required],
        CtrlCAP: [this.data.cap, Validators.required],
      });
      const phoneNumber = parsePhoneNumber(this.FormGroup.get('CtrlCell').value);
      this.dialCode = phoneNumber.countryCallingCode;

    } else {
      this.FormGroup = this.formBuilder.group({
        CtrlName: ['', Validators.required],
        CtrlSurname: ['', Validators.required],
        CtrlCF: ['', [this.fiscaleCodeValidator]],
        CtrlpIva: ['', Validators.required],
        CtrlCompanyName: ['', Validators.required],
        CtrlCell: ['', Validators.required],
        CtrlOffice: [''],
        CtrlMail: ['', Validators.email],
        CtrlAddress: ['', Validators.required],
        CtrlCity: ['', Validators.required],
        CtrlDistrict: ['', Validators.required],
        CtrlCAP: ['', Validators.required],
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public onCountryChange(evt: any): void{
    this.dialCode = evt.dialCode;
  }

  private findContactValue(code: number): string {
    let res = '';
    this.data.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

  public insertFleetManager(): void {
    if (this.register) {
      const dialogRef = this.dialog.open(ModalConfirmComponent, {
        width: '50%',
        height: '30%',
        data: { text: 'FLEET-MANAGER.CONFIRM_REGISTRATION' },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe((resp) => {
        if (resp) {
          const newFleetManager = this.generateFleetManager();
          this.subscription.push(this.registerService.registerFleet(newFleetManager).subscribe(
            () => { this.router.navigate(['../']); }
          ));
        }
      });
    } else {
      const newFleetManager = this.generateFleetManager();
      this.subscription.push(this.fleetManagerService.insertFleetManager(newFleetManager).subscribe(
        () => { this.router.navigate(['../fleet-manager-manage']); },
      ));
    }
  }

  public updateFleetManager(): void {
    const fleetManagerEdit = this.generateFleetManager();
    this.subscription.push(this.fleetManagerService.updateFleetManager(fleetManagerEdit).subscribe(
      () => { this.router.navigate(['../fleet-manager-manage']); }
    ));
  }

  private generateFleetManager(): FleetManager {
    const fleetManager = new FleetManager();

    fleetManager.id = this.data?.id;
    fleetManager.name = this.FormGroup.get('CtrlName').value;
    fleetManager.surname = this.FormGroup.get('CtrlSurname').value;
    fleetManager.fiscalCode = this.FormGroup.get('CtrlCF').value.toUpperCase();
    fleetManager.pIva = this.FormGroup.get('CtrlpIva').value;
    fleetManager.companyName = this.FormGroup.get('CtrlCompanyName').value;
    fleetManager.address = this.FormGroup.get('CtrlAddress').value;
    fleetManager.city = this.FormGroup.get('CtrlCity').value;
    fleetManager.district = this.FormGroup.get('CtrlDistrict').value;
    fleetManager.cap = this.FormGroup.get('CtrlCAP').value;
    fleetManager.contacts = [];

    const office = { code: 2, value: this.FormGroup.get('CtrlOffice').value };
    const mail = { code: 3, value: this.FormGroup.get('CtrlMail').value };

    let formCell = this.FormGroup.get('CtrlCell').value;
    const phoneNumber = parsePhoneNumber(formCell);
    if (!phoneNumber){ // caso nuovo fleet o modifica cell
      formCell = '+' + this.dialCode + formCell;
    }else if (this.dialCode !== phoneNumber.countryCallingCode){ // caso edit fleet
      formCell = '+' + this.dialCode + phoneNumber.nationalNumber;
    }
    const cell = { code: 1, value: formCell };

    console.log(cell);
    fleetManager.contacts.push(cell, office, mail);
    return fleetManager;
  }

  public modalOTP(): void {
    const Cell = this.FormGroup.get('CtrlCell').value;
    const lang = this.translateService.currentLang;
    this.subscription.push(this.registerService.getOtpCode(Cell, lang).subscribe(
      code => {
        const dialogRef = this.dialog.open(ModalOTPComponent, {
          width: '80%',
          height: '50%',
          data: { otp: code, cell: Cell },
          autoFocus: false
        });
        dialogRef.afterClosed().subscribe(
          verify => {
            if (verify) {
              this.verifyOtp = true;
            }
          }
        );
      },
      () => null,
      () => this.ngOnDestroy()
    ));
  }

  private fiscaleCodeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    let cf: CodiceFiscale;
    if (control.value?.length === 16) {
      try {
        cf = new CodiceFiscale(control.value);
        return null;
      } catch (error) {
        return { fiscalCode: true };
      }
    } else {
      return { fiscalCode: true };
    }
  }

}

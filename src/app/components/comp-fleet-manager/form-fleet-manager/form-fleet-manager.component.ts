import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { RegisterService } from 'src/app/services/register.service';
import { FleetManager } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModalOTPComponent } from '../register-page/modal-otp/modal-otp.component';
import parsePhoneNumber, { CountryCallingCode } from 'libphonenumber-js';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { HttpResponse } from '@angular/common/http';
import { IAuthenticationService } from '@npt/npt-template';
import { euroNations, FleetManType, worldNations } from '../../domain/bus-firenze-constants';

@Component({
  selector: 'app-form-fleet-manager',
  templateUrl: './form-fleet-manager.component.html',
  styleUrls: ['./form-fleet-manager.component.css']
})
export class FormFleetManagerComponent implements OnInit, OnDestroy {
  @Input() register = false;
  @Input() data: FleetManager;

  public FormGroup: FormGroup;
  public verifyOtp = false;
  public dialCode: CountryCallingCode = '39';
  public selectedFile: File;
  public roleFleetManager: boolean;
  public isEuropeNat: boolean;
  public nations = worldNations;
  public filteredList = this.nations.slice();
  public fleetType = FleetManType;
  public userTypes: FleetManType[] = [this.fleetType.PRIVATO, this.fleetType.PUBBLICA_AMM, this.fleetType.ENTE];

  private euroNations = euroNations;
  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private registerService: RegisterService,
    private translateService: TranslateService,
    private fleetManagerService: FleetManagerService,
    @Inject('authService') private authService: IAuthenticationService) {
    this.data = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.authService.getUserRoles().then((res: string[]) => this.roleFleetManager = res.includes(ROLES.FLEETMNG));
  }

  ngOnInit(): void {
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data) {
      // cf, p.iva e district validator sono valorizzati in base alla nation
      this.FormGroup = this.formBuilder.group({
        CtrlUser: [this.fleetType.PRIVATO, Validators.required],
        CtrlIpa: [''],
        CtrlName: [this.data.name, Validators.required],
        CtrlSurname: [this.data.surname, Validators.required],
        CtrlCF: [this.data.fiscalCode],
        CtrlpIva: [this.data.pIva],
        CtrlCompanyName: [this.data.companyName, Validators.required],
        CtrlCell: [this.findContactValue(1), [Validators.required]],
        CtrlOffice: [this.findContactValue(2)],
        CtrlMail: [this.findContactValue(3), Validators.email],
        CtrlAddress: [this.data.address, Validators.required],
        CtrlCity: [this.data.city, Validators.required],
        CtrlDistrict: [this.data.district],
        CtrlCAP: [this.data.cap, Validators.required],
        CtrlNat: [this.data.country, Validators.required]
      });
      const phoneNumber = parsePhoneNumber(this.FormGroup.get('CtrlCell').value);
      this.dialCode = phoneNumber.countryCallingCode;
    } else {
      this.FormGroup = this.formBuilder.group({
        CtrlUser: [this.fleetType.PRIVATO, Validators.required],
        CtrlIpa: [''],
        CtrlName: ['', Validators.required],
        CtrlSurname: ['', Validators.required],
        CtrlCF: [''],
        CtrlpIva: [''],
        CtrlCompanyName: ['', Validators.required],
        CtrlCell: ['', [Validators.pattern(/^\d+$/), Validators.required]],
        CtrlOffice: [''],
        CtrlMail: ['', Validators.email],
        CtrlAddress: ['', Validators.required],
        CtrlCity: ['', Validators.required],
        CtrlDistrict: [''],
        CtrlCAP: ['', Validators.required],
        CtrlNat: ['IT', Validators.required]
      });
    }
    this.changeFormNat(true);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public changeFormNat(isFirst?: boolean): void {
    this.isEuropeNat = this.euroNations.includes(this.FormGroup.get('CtrlNat').value);
    if (this.isEuropeNat){
      this.FormGroup.controls.CtrlpIva.setValidators(
        [Validators.pattern(/^\d+$/), Validators.minLength(11), Validators.maxLength(11), Validators.required]);
      this.FormGroup.controls.CtrlCF.setValidators([this.fiscaleCodeValidator]);
      if (this.FormGroup.get('CtrlNat').value !== 'IT') {
        this.FormGroup.controls.CtrlDistrict.setValidators(
          [Validators.minLength(3), Validators.maxLength(3), Validators.required]);
      } else {
        this.FormGroup.controls.CtrlDistrict.setValidators( // solo lettere (provincia italiana)
          [Validators.pattern(/^[A-Za-z]+$/), Validators.minLength(2), Validators.maxLength(2), Validators.required]);
      }
    }else{
      this.FormGroup.controls.CtrlCF.setValidators(null);
      this.FormGroup.controls.CtrlpIva.setValidators(null);
    }
    this.FormGroup.controls.CtrlCF.updateValueAndValidity();
    this.FormGroup.controls.CtrlpIva.updateValueAndValidity();
    // avvia il controllo della piva quando viene cambiata la nazione
    if (!this.FormGroup.controls.CtrlpIva.invalid && !isFirst && this.isEuropeNat) { this.pivaValidator(); }
  }

  public onCountryChange(evt: any): void {
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
          this.subscription.push(this.registerService.registerFleet(this.selectedFile, newFleetManager).subscribe(
            () => { this.router.navigate(['../']); }
          ));
        }
      });
    } else {
      const newFleetManager = this.generateFleetManager();
      this.subscription.push(this.fleetManagerService.insertFleetManager(this.selectedFile, newFleetManager).subscribe(
        () => { this.router.navigate(['../fleet-manager-manage']); },
      ));
    }
  }

  public updateFleetManager(): void {
    const fleetManagerEdit = this.generateFleetManager();
    this.subscription.push(this.fleetManagerService.updateFleetManager(fleetManagerEdit).subscribe(
      () => {
        this.snackBar.showMessage('FLEET-MANAGER.EDIT_SUCCESS', 'INFO');
        this.router.navigate(['../fleet-manager-manage']);
      }
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
    fleetManager.country = this.FormGroup.get('CtrlNat').value;
    fleetManager.contacts = [];

    const office = { code: 2, value: this.FormGroup.get('CtrlOffice').value };
    const mail = { code: 3, value: this.FormGroup.get('CtrlMail').value };
    let formCell = this.FormGroup.get('CtrlCell').value;
    const phoneNumber = parsePhoneNumber(formCell);
    if (!phoneNumber) { // caso nuovo fleet o modifica cell
      formCell = '+' + this.dialCode + formCell;
    } else if (this.dialCode !== phoneNumber.countryCallingCode) { // caso edit fleet
      formCell = '+' + this.dialCode + phoneNumber.nationalNumber;
    }
    const cell = { code: 1, value: formCell.replace(/\s/g, '') }; // toglie gli spazi

    fleetManager.contacts.push(cell, office, mail);
    return fleetManager;
  }

  public modalOTP(): void {
    const Cell = '+' + this.dialCode + this.FormGroup.get('CtrlCell').value.replace(/\s/g, '');
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

  public downloadTemplate(): void {
    const FileSaver = require('file-saver');
    this.subscription.push(this.registerService.getTemplateDocument()
      .subscribe((data: HttpResponse<Blob>) => {
        const contentDispositionHeader = data.headers.get('Content-Disposition');
        const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
        FileSaver.saveAs(data.body, filename);
      },
        () => null));
  }

  public uploadFile(event: any): void {
    const type = event.target.files[0].type;
    if (type === 'application/pdf' || type === 'image/jpeg' || type === 'image/png') {
      this.selectedFile = event.target.files[0];
    } else {
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR');
    }
  }

  private fiscaleCodeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const codiceFiscale = require('codice-fiscale-js');
    if (control.value?.length === 16) {
      if (codiceFiscale.check(control.value)) {
        return null;
      } else {
        return { fiscalCode: true };
      }
    } else if (control.value?.length === 11) {
      const isnum = /^\d+$/.test(control.value);
      if (isnum) { return null; } else { return { fiscalCode: true }; }
    }
    else {
      return { fiscalCode: true };
    }
  }

  public pivaValidator(): void {
    if (!this.FormGroup.controls.CtrlpIva.invalid) {
      const pIva = this.FormGroup.get('CtrlpIva').value;
      const nat = this.FormGroup.get('CtrlNat').value;
      this.FormGroup.controls.CtrlpIva.setErrors({ invalid: true });
      this.subscription.push(this.fleetManagerService.checkVatNumber(nat, pIva).subscribe(
        vatVerify => {
          console.log(vatVerify);
          if (!vatVerify.valid) {
            this.FormGroup.controls.CtrlpIva.setErrors({ invalid: true });
          } else {
            this.FormGroup.controls.CtrlpIva.setErrors(null);
          }
        }
      ));
    }
  }

  public pivaOfFcValidator(): void {
    const fiscalCode = this.FormGroup.get('CtrlCF').value;
    this.FormGroup.patchValue({ CtrlCF: fiscalCode.toUpperCase() });
    if (!this.FormGroup.controls.CtrlCF.invalid && fiscalCode.length === 11) {
      const nat = this.FormGroup.get('CtrlNat').value;
      this.FormGroup.controls.CtrlCF.setErrors({ invalid: true });
      this.subscription.push(this.fleetManagerService.checkVatNumber(nat, fiscalCode).subscribe(
        vatVerify => {
          console.log(vatVerify);
          if (!vatVerify.valid) {
            this.FormGroup.controls.CtrlCF.setErrors({ invalid: true });
          } else {
            this.FormGroup.controls.CtrlCF.setErrors(null);
          }
        }
      ));
    }
  }

}

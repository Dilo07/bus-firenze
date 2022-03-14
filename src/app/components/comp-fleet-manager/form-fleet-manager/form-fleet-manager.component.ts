import { HttpResponse } from '@angular/common/http';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IAuthenticationService } from '@npt/npt-template';
import parsePhoneNumber, { CountryCallingCode } from 'libphonenumber-js';
import { Subscription } from 'rxjs';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { RegisterService } from 'src/app/services/register.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { euroNations, FLEETMNG_TYPE, worldNations } from '../../domain/bus-firenze-constants';
import { FleetManager } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModalOTPComponent } from '../register-page/modal-otp/modal-otp.component';

@Component({
  selector: 'app-form-fleet-manager',
  templateUrl: './form-fleet-manager.component.html',
  styleUrls: ['./form-fleet-manager.component.css']
})
export class FormFleetManagerComponent implements OnInit, OnDestroy {
  @Input() register = false;
  @Input() data: FleetManager;

  public formGroup: FormGroup;
  public verifyOtp = false;
  public dialCode: CountryCallingCode = '39';
  public selectedFile: File;
  public roleFleetManager: boolean;
  public isEuropeNat: boolean;
  public nations = worldNations;
  public filteredList = this.nations.slice();
  public fleetType = FLEETMNG_TYPE;
  public userTypes = [this.fleetType.DITTA_INDIVIDUALE, this.fleetType.AZIENDA_PRIVATA, this.fleetType.PUBBLICA_AMM, this.fleetType.ENTE];
  public userSel: string = this.fleetType.AZIENDA_PRIVATA;
  public completePiva = true;
  public completePiva2 = true;

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
  }

  async ngOnInit(): Promise<void> {
    if (!this.register) {
      await this.authService.getUserRoles().then((res: string[]) => this.roleFleetManager = res.includes(ROLES.FLEETMNG));
    }
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data) {
      // cf, p.iva validator sono valorizzati in base alla nation
      this.formGroup = this.formBuilder.group({
        ctrlContractCode: [this.data.contractCode],
        ctrlSapCode: [this.data.idSap],
        ctrlUser: [{ value: this.data.companyType, disabled: this.roleFleetManager ? true : false }, Validators.required],
        ctrlDest: [this.data.codeDest],
        ctrlName: [this.data.name, Validators.required],
        ctrlSurname: [this.data.surname, Validators.required],
        ctrlCF: [this.data.fiscalCode],
        ctrlpIva: [this.data.pIva],
        ctrlCompanyName: [this.data.companyName, Validators.required],
        ctrlCell: [this.findContactValue(1), [Validators.required]],
        ctrlOffice: [this.findContactValue(2)],
        ctrlMail: [this.findContactValue(3), Validators.email],
        ctrlAddress: [this.data.address, Validators.required],
        ctrlCity: [this.data.city, Validators.required],
        ctrlDistrict: [this.data.district],
        ctrlCAP: [this.data.cap],
        ctrlNat: [{ value: this.data.country, disabled: this.roleFleetManager ? true : false }, Validators.required]
      });
      const phoneNumber = parsePhoneNumber(this.formGroup.get('ctrlCell').value);
      this.dialCode = phoneNumber.countryCallingCode;
    } else {
      this.formGroup = this.formBuilder.group({
        ctrlContractCode: [''],
        ctrlUser: [this.fleetType.AZIENDA_PRIVATA, Validators.required],
        ctrlDest: [''],
        ctrlName: ['', Validators.required],
        ctrlSurname: ['', Validators.required],
        ctrlCF: [''],
        ctrlpIva: [''],
        ctrlCompanyName: ['', Validators.required],
        ctrlCell: ['', [Validators.pattern(/^\d+$/), Validators.required]],
        ctrlOffice: [''],
        ctrlMail: ['', Validators.email],
        ctrlAddress: ['', Validators.required],
        ctrlCity: ['', Validators.required],
        ctrlDistrict: [''],
        ctrlCAP: [''],
        ctrlNat: ['IT', Validators.required]
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
    this.isEuropeNat = this.euroNations.includes(this.formGroup.get('ctrlNat').value);
    if (this.isEuropeNat) { // se è europeo
      if (this.formGroup.get('ctrlNat').value === 'IT') {
        this.formGroup.controls.ctrlDistrict.setValidators( // solo lettere (provincia italiana)
          [Validators.pattern(/^[A-Za-z]+$/), Validators.minLength(2), Validators.maxLength(2), Validators.required]);
        this.formGroup.controls.ctrlDest.setValidators( // se azienda Priv 7 caratteri se pubbl aministrazione 6
          this.userSel === this.fleetType.AZIENDA_PRIVATA ? [Validators.required, Validators.minLength(7), Validators.maxLength(7)]
            : this.userSel === this.fleetType.PUBBLICA_AMM ? [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
              : null);
      } else {
        this.formGroup.controls.ctrlDistrict.setValidators(null);
        this.formGroup.controls.ctrlDest.setValidators(null);
      }
    } else { // extra ue
      this.formGroup.controls.ctrlDistrict.setValidators(null);
      this.formGroup.controls.ctrlDest.setValidators(null);
    }
    // resetta i dati al cambio della nazione
    if (!isFirst) { this.resetCompanyInfo(); }
    this.formGroup.controls.ctrlDistrict.updateValueAndValidity();
    this.formGroup.controls.ctrlDest.updateValueAndValidity();
  }

  public countryMobileChange(evt: any): void {
    this.dialCode = evt.dialCode;
  }

  public insertFleetManager(): void {
    const newFleetManager = this.generateFleetManager();
    if (this.register) {
      const dialogRef = this.dialog.open(ModalConfirmComponent, {
        width: '50%',
        height: '30%',
        data: { text: 'FLEET-MANAGER.CONFIRM_REGISTRATION' },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe((resp) => {
        if (resp) {
          this.subscription.push(this.registerService.registerFleet(this.selectedFile, newFleetManager).subscribe(
            () => { this.router.navigate(['../']); }
          ));
        }
      });
    } else {
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

  public modalOTP(): void {
    const valCell = '+' + this.dialCode + this.formGroup.get('ctrlCell').value.replace(/\s/g, '');
    const lang = this.translateService.currentLang;
    this.subscription.push(this.registerService.getOtpCode(valCell, lang).subscribe(
      code => {
        const dialogRef = this.dialog.open(ModalOTPComponent, {
          width: '80%',
          height: '50%',
          data: { otp: code, cell: valCell },
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
    const fileSaver = require('file-saver');
    this.subscription.push(this.registerService.getTemplateDocument()
      .subscribe(
        (data: HttpResponse<Blob>) => {
          const contentDispositionHeader = data.headers.get('Content-Disposition');
          const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
          fileSaver.saveAs(data.body, filename);
        }));
  }

  public uploadFile(event: any): void {
    const type = event.target.files[0].type;
    if (type === 'application/pdf' || type === 'image/jpeg' || type === 'image/png') {
      this.selectedFile = event.target.files[0];
    } else {
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR');
    }
  }

  public pivaValidator(): void {
    if (!this.formGroup.controls.ctrlpIva.invalid && this.isEuropeNat && !this.roleFleetManager) {
      const pIva = this.formGroup.get('ctrlpIva').value;
      const nat = this.formGroup.get('ctrlNat').value;
      this.formGroup.controls.ctrlpIva.setErrors({ invalid: true });
      this.completePiva = false;
      this.subscription.push(this.registerService.checkVatNumber(nat, pIva).subscribe(
        vatVerify => {
          console.log(vatVerify);
          if (!vatVerify.valid) {
            this.formGroup.controls.ctrlpIva.setErrors({ invalid: true });
          } else {
            this.formGroup.controls.ctrlpIva.setErrors(null);
            const companyName = vatVerify.name.substring(0, 40);
            this.formGroup.patchValue({
              ctrlCompanyName: companyName
            });
          }
        },
        () => this.completePiva = true,
        () => this.completePiva = true
      ));
    }
  }

  public pivaOrFcValidator(): void {
    const fiscalCode = this.formGroup.get('ctrlCF').value;
    const userType = this.formGroup.get('ctrlUser').value;
    if (!this.formGroup.controls.ctrlCF.invalid && !this.roleFleetManager) {
      if (userType === this.fleetType.DITTA_INDIVIDUALE) {
        const codiceFiscale = require('codice-fiscale-js');
        this.formGroup.patchValue({ ctrlCF: fiscalCode.toUpperCase() });
        if (codiceFiscale.check(fiscalCode)) {
          this.formGroup.controls.ctrlCF.setErrors(null);
        } else {
          this.formGroup.controls.ctrlCF.setErrors({ invalid: true });
        }
      } else if (userType === this.fleetType.ENTE) {
        if ((fiscalCode.charAt(0) === '8' || fiscalCode.charAt(0) === '9') && fiscalCode.length === 11) {
          this.formGroup.controls.ctrlCF.setErrors(null);
        } else {
          this.formGroup.controls.ctrlCF.setErrors({ invalid: true });
        }
      } else {
        const nat = this.formGroup.get('ctrlNat').value;
        this.formGroup.controls.ctrlCF.setErrors({ invalid: true });
        this.completePiva2 = false;
        this.subscription.push(this.registerService.checkVatNumber(nat, fiscalCode).subscribe(
          vatVerify => {
            console.log(vatVerify);
            if (!vatVerify.valid) {
              this.formGroup.controls.ctrlCF.setErrors({ invalid: true });
            } else {
              this.formGroup.controls.ctrlCF.setErrors(null);
            }
          },
          () => this.completePiva2 = true,
          () => this.completePiva2 = true
        ));
      }
    }
  }

  private resetCompanyInfo(): void {
    // se viene cambiato il tipo azienda setta la nazione a IT e richiama changeFormNat per rivalidare e svuotare
    // se viene cambiata la nazione svuota le info societa e basta
    this.formGroup.patchValue({
      ctrlCF: '',
      ctrlpIva: '',
      ctrlDest: '',
      ctrlCompanyName: '',
      ctrlAddress: '',
      ctrlCity: '',
      ctrlDistrict: '',
      ctrlCAP: ''
    });

  }

  private generateFleetManager(): FleetManager {
    const fleetManager = new FleetManager();

    fleetManager.id = this.data?.id;
    fleetManager.contractCode = this.formGroup.get('ctrlContractCode').value ? this.formGroup.get('ctrlContractCode').value : null;
    fleetManager.codeDest = this.formGroup.get('ctrlDest').value ? this.formGroup.get('ctrlDest').value : null;
    fleetManager.name = this.formGroup.get('ctrlName').value;
    fleetManager.surname = this.formGroup.get('ctrlSurname').value;
    fleetManager.companyType = this.formGroup.get('ctrlUser').value;
    fleetManager.fiscalCode = this.formGroup.get('ctrlCF').value.toUpperCase();
    fleetManager.pIva = this.formGroup.get('ctrlpIva').value;
    fleetManager.companyName = this.formGroup.get('ctrlCompanyName').value;
    fleetManager.address = this.formGroup.get('ctrlAddress').value;
    fleetManager.city = this.formGroup.get('ctrlCity').value;
    fleetManager.district = this.formGroup.get('ctrlDistrict').value;
    fleetManager.cap = this.formGroup.get('ctrlCAP').value;
    fleetManager.country = this.formGroup.get('ctrlNat').value;
    fleetManager.extraUE = !this.isEuropeNat;
    fleetManager.contacts = [];

    const office = { code: 2, value: this.formGroup.get('ctrlOffice').value };
    const mail = { code: 3, value: this.formGroup.get('ctrlMail').value };
    let formCell = this.formGroup.get('ctrlCell').value;
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

  private findContactValue(code: number): string {
    let res = '';
    this.data.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

}

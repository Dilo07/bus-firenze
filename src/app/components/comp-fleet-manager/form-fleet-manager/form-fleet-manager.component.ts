import { HttpResponse } from '@angular/common/http';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Breadcrumb, IAuthenticationService, SnackBar } from '@npt/npt-template';
import parsePhoneNumber, { CountryCallingCode } from 'libphonenumber-js';
import { Subscription } from 'rxjs';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { NoAuthRegisterService } from 'src/app/services/noAuth-register.service';
import { euroNations, FLEETMNG_TYPE, worldNations } from '../../domain/bus-firenze-constants';
import { FleetManager } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModalOTPComponent } from '../register-page/modal-otp/modal-otp.component';
import { ModalCheckComponent } from './modal-check/modal-check.component';

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
  public fileModule: File;
  public fileIdentityCard: File;
  public fileCommerceReg: File;
  public isEuropeNat: boolean;
  public isItalian: boolean;
  public nations = worldNations;
  public filteredList = this.nations.slice();
  public fleetType = FLEETMNG_TYPE;
  public userTypes = [this.fleetType.dittaIndividuale, this.fleetType.aziendaPrivata, this.fleetType.pubblicaAmm, this.fleetType.ente];
  public userSel: string;
  public completePiva = true;
  public completePiva2 = true;
  public helper: 'on' | 'off';
  public completeUp = true;
  public completeDown = true;
  public breadCrumb: Breadcrumb[] = [];

  private failedCheck: boolean;
  private euroNations = euroNations;
  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private registerService: NoAuthRegisterService,
    private translateService: TranslateService,
    private fleetManagerService: FleetManagerService,
    @Inject('authService') private authService: IAuthenticationService) {
    this.data = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data) {
      // cf, p.iva validator sono valorizzati in base alla nation
      this.formGroup = this.formBuilder.group({
        ctrlContractCode: [this.data.contractCode],
        ctrlSapCode: [this.data.idSap],
        ctrlUser: [this.data.companyType, Validators.required],
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
        ctrlNat: [this.data.country, Validators.required]
      });
      this.userSel = this.data.companyType;
      const phoneNumber = parsePhoneNumber(this.formGroup.get('ctrlCell').value);
      this.dialCode = phoneNumber.countryCallingCode;
      this.helper = 'off';
      this.breadCrumb = [
        {
          label: 'Fleet manager',
          url: '/manage'
        },
        {
          label: `${this.data.name} ${this.data.surname}`,
          url: '../selection-card',
          state: { fleetManager: this.data }
        },
        {
          label: 'ACCOUNT.PROFILE',
          url: ''
        }
      ];
    } else {
      this.formGroup = this.formBuilder.group({
        ctrlContractCode: [''],
        ctrlUser: [this.fleetType.aziendaPrivata, Validators.required],
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
        ctrlNat: ['IT', Validators.required],
        ctrlFileModule: ['', Validators.required],
        ctrlFileIdentityCrd: ['', Validators.required],
        ctrlFileCommerceReg: ['', Validators.required],
        ctrlConsent: [false, Validators.requiredTrue]
      });
      this.userSel = this.fleetType.aziendaPrivata;
      this.helper = 'on';
      this.breadCrumb = [
        {
          label: 'Fleet manager',
          url: '/manage'
        },
        {
          label: 'FLEET-MANAGER.ADD_NEW',
          url: ''
        }
      ];
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
    this.isItalian = this.formGroup.get('ctrlNat').value === 'IT';
    if (this.isEuropeNat) { // se è europeo
      if (this.formGroup.get('ctrlNat').value === 'IT') {
        this.formGroup.controls.ctrlDistrict.setValidators( // solo lettere (provincia italiana)
          [Validators.pattern(/^[A-Za-z]+$/), Validators.minLength(2), Validators.maxLength(2), Validators.required]);
        this.formGroup.controls.ctrlDest.setValidators( // se azienda Priv 7 caratteri se pubbl aministrazione 6
          this.userSel === this.fleetType.aziendaPrivata ? [Validators.required, Validators.minLength(7), Validators.maxLength(7)]
            : this.userSel === this.fleetType.pubblicaAmm ? [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
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
    if (this.register) {
      const dialogRef = this.dialog.open(ModalConfirmComponent, {
        width: '50%',
        height: '30%',
        data: { text: 'FLEET-MANAGER.CONFIRM_REGISTRATION' },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe((resp) => {
        if (resp) {
          this.registerFleetApi();
        }
      });
    } else {
      this.registerFleetApi();
    }
  }

  public updateFleetManager(): void {
    const fleetManagerEdit = this.generateFleetManager();
    this.subscription.push(this.fleetManagerService.updateFleetManager(fleetManagerEdit).subscribe(
      () => {
        this.snackBar.showMessage('FLEET-MANAGER.EDIT_SUCCESS', 'INFO');
        this.router.navigate(['../manage']);
      }
    ));
  }

  public async modalOTP(): Promise<void> {
    const valCell = '+' + this.dialCode + this.formGroup.get('ctrlCell').value.replace(/\s/g, '');
    const lang = this.translateService.currentLang;
    this.subscription.push((await this.registerService.getOtpCode(valCell, lang, this.register ? true : false)).subscribe({
      next: (code) => {
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
      complete: () => this.ngOnDestroy()
    }));
  }

  public async downloadTemplate(): Promise<void> {
    this.completeUp = false;
    const fileSaver = require('file-saver');
    this.subscription.push((await this.registerService.getTemplateDocument(this.register ? true : false))
      .subscribe({
        next: (data: HttpResponse<Blob>) => {
          const contentDispositionHeader = data.headers.get('Content-Disposition');
          const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
          fileSaver.saveAs(data.body, filename);
        },
        error: () => this.completeUp = true,
        complete: () => this.completeUp = true
      }));
  }

  public uploadFile(files: File[], typeFile: number): void {
    if (files.length > 0) {
      const type = files[0].type;
      const size = files[0].size;
      switch (typeFile) {
        case 1:
          if (type !== 'application/pdf' && type !== 'image/jpeg' && type !== 'image/png') {
            this.fileModule = null;
            this.formGroup.patchValue({ ctrlFileModule: '' });
            this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR');
          } else if (size > 2097152) { // dimensione massima
            this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
          } else {
            this.snackBar.showMessage('FLEET-MANAGER.SUCCESS_FILE', 'INFO');
            this.fileModule = files[0];
          }
          break;
        case 2:
          if (type !== 'application/pdf' && type !== 'image/jpeg' && type !== 'image/png') {
            this.fileIdentityCard = null;
            this.formGroup.patchValue({ ctrlFileIdentityCrd: '' });
            this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR');
          } else if (size > 2097152) { // dimensione massima
            this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
          } else {
            this.snackBar.showMessage('FLEET-MANAGER.SUCCESS_IDENTIYCRD', 'INFO');
            this.fileIdentityCard = files[0];
          }
          break;
        case 3:
          if (type !== 'application/pdf' && type !== 'image/jpeg' && type !== 'image/png') {
            this.fileCommerceReg = null;
            this.formGroup.patchValue({ ctrlFileCommerceReg: '' });
            this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR');
          } else if (size > 2097152) { // dimensione massima
            this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
          } else {
            this.snackBar.showMessage('FLEET-MANAGER.SUCCESS_COMMERCEREG', 'INFO');
            this.fileCommerceReg = files[0];
          }
          break;
      }
    } else {
      switch (typeFile) { // nel caso in cui annulla nella seleziona file, rimane il file precedente e il validatore rimane valido
        case 1:
          if (this.fileModule) {
            this.formGroup.get('ctrlFileModule').setValidators(null);
            this.formGroup.get('ctrlFileModule').updateValueAndValidity();
          }
          break;
        case 2:
          if (this.fileIdentityCard) {
            this.formGroup.get('ctrlFileIdentityCrd').setValidators(null);
            this.formGroup.get('ctrlFileIdentityCrd').updateValueAndValidity();
          }
          break;
        case 3:
          if (this.fileCommerceReg) {
            this.formGroup.get('ctrlFileCommerceReg').setValidators(null);
            this.formGroup.get('ctrlFileCommerceReg').updateValueAndValidity();
          }
          break;
      }
    }
  }

  public async pivaValidator(): Promise<void> {
    if (!this.formGroup.controls.ctrlpIva.invalid && this.isEuropeNat) {
      const pIva = this.formGroup.get('ctrlpIva').value;
      const nat = this.formGroup.get('ctrlNat').value;
      this.completePiva = false;
      this.subscription.push((await this.registerService.checkVatNumber(nat, pIva, this.register ? true : false)).subscribe({
        next: (vatVerify) => {
          if (vatVerify.valid) { // p.iva valida
            this.snackBar.showMessage('FLEET-MANAGER.VAT_VERIFY', 'INFO');
            const companyName = vatVerify.name.substring(0, 35);
            this.formGroup.patchValue({
              ctrlCompanyName: companyName
            });
            this.failedCheck = false;
          }
        },
        error: (error) => { // p.iva non valida o servizio down
          if (error.error.confirm) {
            const ref = this.dialog.open(ModalCheckComponent, {
              width: '40%',
              height: '40%',
              data: { vat: pIva }
            });
            ref.afterClosed().subscribe(
              (resp) => {
                if (!resp) {
                  this.formGroup.patchValue({ ctrlpIva: '' });
                } else { // utente accetta p.iva non valida sul servizio
                  this.failedCheck = true;
                }
              }
            );
          }
          this.completePiva = true;
        },
        complete: () => this.completePiva = true
      }));
    }
  }

  public async pivaOrFcValidator(): Promise<void> {
    const fiscalCode = this.formGroup.get('ctrlCF').value;
    const userType = this.formGroup.get('ctrlUser').value;
    if (!this.formGroup.controls.ctrlCF.invalid) {
      if (userType === this.fleetType.dittaIndividuale) {
        const codiceFiscale = require('codice-fiscale-js');
        this.formGroup.patchValue({ ctrlCF: fiscalCode.toUpperCase() });
        if (codiceFiscale.check(fiscalCode)) {
          this.formGroup.controls.ctrlCF.setErrors(null);
        } else {
          this.formGroup.controls.ctrlCF.setErrors({ invalid: true });
        }
      } else if (userType === this.fleetType.ente) {
        if (fiscalCode.length === 11) {
          this.formGroup.controls.ctrlCF.setErrors(null);
        } else {
          this.formGroup.controls.ctrlCF.setErrors({ invalid: true });
        }
      } else {
        const nat = this.formGroup.get('ctrlNat').value;
        this.completePiva2 = false;
        this.subscription.push((await this.registerService.checkVatNumber(nat, fiscalCode, this.register ? true : false))
          .subscribe({
            next: (vatVerify) => { // p.iva valida
              if (vatVerify.valid) {
                this.snackBar.showMessage('FLEET-MANAGER.FISCALCODE_VERIFY', 'INFO');
                this.failedCheck = false;
              }
            },
            error: (error) => { // p.iva non valida o servizio down
              if (error.error.confirm) {
                const ref = this.dialog.open(ModalCheckComponent, {
                  width: '40%',
                  height: '40%',
                  data: { fiscalCode: fiscalCode }
                });
                ref.afterClosed().subscribe(
                  (resp) => {
                    if (!resp) {
                      this.formGroup.patchValue({ ctrlCF: '' });
                    } else { // utente accetta p.iva non valida sul servizio
                      this.failedCheck = true;
                    }
                  }
                );
              }
              this.completePiva2 = true;
            },
            complete: () => this.completePiva2 = true
          }));
      }
    }
  }

  private async registerFleetApi(): Promise<void> {
    this.completeDown = false;
    const newFleetManager = this.generateFleetManager();
    this.subscription.push(
      (await this.registerService.registerFleet(
        this.fileModule,
        this.fileIdentityCard,
        this.fileCommerceReg,
        newFleetManager,
        this.register ? true : false))
        .subscribe({
          next: () => {
            this.snackBar.showMessage('FLEET-MANAGER.SUCCESS_REGISTER', 'INFO');
            this.register ? this.router.navigate(['../']) : this.router.navigate(['../manage']);
          },
          error: () => this.completeDown = true,
          complete: () => this.completeDown = true,
        }));
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
    // se è un edit e non è stata modificata la p.iva o c.f. lascia l'esistente altrimenti prende il valore di failedCheck
    fleetManager.failedCheck = this.data ? (this.failedCheck === undefined ? this.data.failedCheck : this.failedCheck) : this.failedCheck;
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

import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IAuthenticationService } from '@npt/npt-template';
import { CountryCallingCode, parsePhoneNumber } from 'libphonenumber-js';
import { Subscription } from 'rxjs';
import { Driver } from 'src/app/components/domain/bus-firenze-domain';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { DriverService } from 'src/app/services/driver.service';
import { RegisterService } from 'src/app/services/register.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { ModalOTPComponent } from '../../register-page/modal-otp/modal-otp.component';

@Component({
  selector: 'app-form-driver',
  templateUrl: './form-driver.component.html',
  styles: [
  ]
})
export class FormDriverComponent implements OnInit, OnDestroy {
  @Input() driver: Driver;
  @Input() fleetManagerId: number;
  @Input() cellularRequired: boolean;
  public formGroup: FormGroup;
  public roleDriver: boolean;
  public verifyOtp = false;
  public dialCode: CountryCallingCode = '39';

  private subscription: Subscription[] = [];
  private cellForm: string;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private registerService: RegisterService,
    private translateService: TranslateService,
    private snackBar: SnackBar,
    @Inject('authService') private authService: IAuthenticationService,
  ) {
    this.driver = this.router.getCurrentNavigation()?.extras.state?.driver as Driver;
    this.fleetManagerId = this.router.getCurrentNavigation()?.extras.state?.fleetManagerId as number;
    this.cellularRequired = this.router.getCurrentNavigation()?.extras.state?.cellularRequired as boolean;
  }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleDriver = res.includes(ROLES.DRIVER));
    if (this.driver) {
      this.formGroup = this.formBuilder.group({
        ctrlName: [this.driver.name, Validators.required],
        ctrlSurname: [this.driver.surname, Validators.required],
        ctrlMail: [this.findContactValue(3), Validators.email]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        ctrlName: ['', Validators.required],
        ctrlSurname: ['', Validators.required],
        ctrlMail: ['', Validators.email]
      });
    }
    if (this.cellularRequired) {
      this.formGroup.addControl('CtrlCell', this.formBuilder.control('', Validators.required));
    }
    if (this.roleDriver) {
      this.formGroup.addControl('CtrlCell', this.formBuilder.control(this.findContactValue(1), Validators.required));
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public modalOTP(): void {
    if (this.cellularRequired) {
      this.cellForm = '+' + this.dialCode + this.formGroup.get('CtrlCell').value.replace(/\s/g, '');
    } else {
      if (this.formGroup.get('CtrlCell').value.charAt(0) === '+') { // se c'?? gi?? un dial code prende solo il numero senza dial code
        const natNumber = parsePhoneNumber(this.formGroup.get('CtrlCell').value).nationalNumber; // estrae il num cell senza prefisso
        this.cellForm = '+' + this.dialCode + natNumber;
      } else {
        this.cellForm = '+' + this.dialCode + this.formGroup.get('CtrlCell').value.replace(/\s/g, '');
      }
    }
    const lang = this.translateService.currentLang;
    this.subscription.push(this.registerService.getOtpCode(this.cellForm, lang).subscribe(
      code => {
        const dialogRef = this.dialog.open(ModalOTPComponent, {
          width: '80%',
          height: '50%',
          data: { otp: code, cell: this.cellForm },
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

  public addDriver(): void {
    const newDriver = new Driver();
    newDriver.name = this.formGroup.get('ctrlName').value;
    newDriver.surname = this.formGroup.get('ctrlSurname').value;
    newDriver.contacts = [];
    const mail = { code: 3, value: this.formGroup.get('ctrlMail').value };
    newDriver.contacts.push(mail);
    this.driverService.addDriver(newDriver, this.fleetManagerId).subscribe(
      () => null,
      () => this.snackBar.showMessage('DRIVERS.ADD_ERROR', 'ERROR'),
      () => {
        this.snackBar.showMessage('DRIVERS.ADD_SUCCESS', 'INFO');
        this.router.navigate(['fleet-manager-manage/drivers'], { state: { fleetManagerId: this.fleetManagerId } });
      }
    );
  }

  public editDriver(): void {
    const editDriver = this.driver;
    const mobile = this.findContactValue(1);
    editDriver.name = this.formGroup.get('ctrlName').value;
    editDriver.surname = this.formGroup.get('ctrlSurname').value;
    editDriver.contacts = [];
    const mail = { code: 3, value: this.formGroup.get('ctrlMail').value };
    /* se ?? stata eseguita la verifica otp prende da cellForm,, altrimenti ?? un fleet role (che non pu?? modificare il numero)
    e lascia quello che c'?? */
    const cell = { code: 1, value: this.cellForm ? this.cellForm : mobile };
    editDriver.contacts.push(mail, cell);
    this.driverService.editDriver(
      editDriver,
      this.roleDriver ? null : editDriver.id,
      this.roleDriver ? null : this.fleetManagerId).subscribe(
      () => null,
      () => this.snackBar.showMessage('DRIVERS.EDIT_ERROR', 'ERROR'),
      () => {
        this.snackBar.showMessage('DRIVERS.EDIT_SUCCESS', 'INFO');
        if (this.roleDriver && this.cellularRequired) {
          this.router.navigate(['user-driver/anagraphic-driver']);
          this.cellularRequired = false;
        }
        if (!this.roleDriver) {
          this.router.navigate(['fleet-manager-manage/drivers'], { state: { fleetManagerId: this.fleetManagerId } });
        }
      }
    );
  }

  public onCountryChange(evt: any): void {
    this.dialCode = evt.dialCode;
  }

  private findContactValue(code: number): string {
    let res = '';
    this.driver.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

}

import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CountryCallingCode } from 'libphonenumber-js';
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
  public FormGroup: FormGroup;
  public roleDriver: boolean;
  public verifyOtp = false;
  public dialCode: CountryCallingCode = '39';

  private subscription: Subscription[] = [];

  constructor(
    /* public dialogRef: MatDialogRef<FormDriverComponent>, */
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private registerService: RegisterService,
    private translateService: TranslateService,
    private snackBar: SnackBar,
    @Inject('authService') private authService,
    /* @Inject(MAT_DIALOG_DATA) public data: { driver: Driver, fleetManagerId: number, cellularRequired: boolean } */) {
    this.driver = this.router.getCurrentNavigation()?.extras.state?.driver as Driver;
    this.fleetManagerId = this.router.getCurrentNavigation()?.extras.state?.fleetManagerId as number;
    this.cellularRequired = this.router.getCurrentNavigation()?.extras.state?.cellularRequired as boolean;
    this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
  }

  ngOnInit(): void {
    if (this.driver) {
      this.FormGroup = this.formBuilder.group({
        CtrlName: [this.driver.name, Validators.required],
        CtrlSurname: [this.driver.surname, Validators.required],
        CtrlMail: [this.findContactValue(3), Validators.email]
      });
    } else {
      this.FormGroup = this.formBuilder.group({
        CtrlName: ['', Validators.required],
        CtrlSurname: ['', Validators.required],
        CtrlMail: ['', Validators.email]
      });
    }
    if (this.cellularRequired) {
      this.FormGroup.addControl('CtrlCell', this.formBuilder.control('', Validators.required));
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public modalOTP(): void {
    const Cell = '+' + this.dialCode + this.FormGroup.get('CtrlCell').value;
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

  public addDriver(): void {
    const newDriver = new Driver();
    newDriver.name = this.FormGroup.get('CtrlName').value;
    newDriver.surname = this.FormGroup.get('CtrlSurname').value;
    newDriver.contacts = [];
    const mail = { code: 3, value: this.FormGroup.get('CtrlMail').value };
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
    editDriver.name = this.FormGroup.get('CtrlName').value;
    editDriver.surname = this.FormGroup.get('CtrlSurname').value;
    editDriver.contacts = [];
    const mail = { code: 3, value: this.FormGroup.get('CtrlMail').value };
    editDriver.contacts.push(mail);
    if (this.FormGroup.get('CtrlCell')?.value) {
      const formCell = '+' + this.dialCode + this.FormGroup.get('CtrlCell').value;
      const cell = { code: 1, value: formCell };
      editDriver.contacts.push(cell);
    } else if (mobile) {
      const formCell = mobile;
      const cell = { code: 1, value: formCell };
      editDriver.contacts.push(cell);
    }
    this.driverService.editDriver(
      editDriver,
      this.roleDriver ? null : editDriver.id,
      this.roleDriver ? null : this.fleetManagerId).subscribe(
        () => null,
        () => this.snackBar.showMessage('DRIVERS.EDIT_ERROR', 'ERROR'),
        () => {
          this.snackBar.showMessage('DRIVERS.EDIT_SUCCESS', 'INFO');
          this.router.navigate(['fleet-manager-manage/drivers'], { state: { fleetManagerId: this.fleetManagerId } });
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

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Driver } from 'src/app/components/domain/bus-firenze-domain';
import { DriverService } from 'src/app/services/driver.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';

@Component({
  selector: 'app-form-driver',
  templateUrl: './form-driver.component.html',
  styles: [
  ]
})
export class FormDriverComponent implements OnInit {
  public FormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormDriverComponent>,
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private snackBar: SnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {driver: Driver, fleetManagerId: number} ) {  }

  ngOnInit(): void {
    if (this.data.driver) {
      this.FormGroup = this.formBuilder.group({
        CtrlName: [this.data.driver.name, Validators.required],
        CtrlSurname: [this.data.driver.surname, Validators.required],
        CtrlMail: [this.findContactValue(3), Validators.email]
      });

    } else {
      this.FormGroup = this.formBuilder.group({
        CtrlName: ['', Validators.required],
        CtrlSurname: ['', Validators.required],
        CtrlMail: ['', Validators.email]
      });
    }
  }

  public addDriver(): void {
    const newDriver = new Driver();
    newDriver.name = this.FormGroup.get('CtrlName').value;
    newDriver.surname = this.FormGroup.get('CtrlSurname').value;
    newDriver.contacts = [];
    const mail = { code: 3, value: this.FormGroup.get('CtrlMail').value };
    newDriver.contacts.push(mail);
    this.driverService.addDriver(newDriver, this.data.fleetManagerId).subscribe(
      () => null,
      () => this.snackBar.showMessage('DRIVERS.ADD_ERROR', 'ERROR'),
      () => { this.snackBar.showMessage('DRIVERS.ADD_SUCCESS', 'INFO'); this.dialogRef.close(true); }
    );
  }

  private findContactValue(code: number): string {
    let res = '';
    this.data.driver.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

}

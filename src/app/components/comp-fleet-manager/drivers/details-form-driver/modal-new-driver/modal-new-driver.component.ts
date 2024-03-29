import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBar } from '@npt/npt-template';
import { Driver, FleetManager } from 'src/app/components/domain/bus-firenze-domain';
import { DriverService } from 'src/app/services/driver.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-new-driver',
  templateUrl: './modal-new-driver.component.html',
  styleUrls: ['./modal-new-driver.component.css']
})
export class ModalNewDriverComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private snackBar: SnackBar,
    private driverService: DriverService,
    public dialogRef: MatDialogRef<ModalNewDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {fleetManager: FleetManager; countDriver: number}) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      ctrlName: [this.translate.instant('MENU.User-Driver') + (this.data.countDriver + 1)],
      ctrlSurname: [this.translate.instant('MENU.User-Driver') + (this.data.countDriver + 1)],
      ctrlMail: ['', [Validators.required, Validators.email]]
    });
  }

  public addDriver(): void {
    const newDriver = new Driver();
    newDriver.name = this.formGroup.get('ctrlName').value;
    newDriver.surname = this.formGroup.get('ctrlSurname').value;
    newDriver.contacts = [];
    const mail = { code: 3, value: this.formGroup.get('ctrlMail').value };
    newDriver.contacts.push(mail);
    this.driverService.addDriver(newDriver, this.data?.fleetManager?.id).subscribe({
      error: () => this.snackBar.showMessage('DRIVERS.ADD_ERROR', 'ERROR'),
      complete: () => {
        this.snackBar.showMessage('DRIVERS.ADD_SUCCESS', 'INFO');
        this.dialogRef.close(true);
      }
    });
  }
}

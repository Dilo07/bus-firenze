import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Driver } from 'src/app/components/domain/bus-firenze-domain';
import { DriverService } from 'src/app/services/driver.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';

@Component({
  selector: 'app-anagraphic-driver',
  templateUrl: './anagraphic-driver.component.html',
  styles: [
  ]
})
export class AnagraphicDriverComponent implements OnInit, OnDestroy {
  public complete = true;
  public driver: Driver;
  public FormGroup: FormGroup;

  private subscription: Subscription[] = [];

  constructor(
    private driverService: DriverService,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar
  ) { }

  ngOnInit(): void {
    this.complete = false;
    this.driverService.getDriver().subscribe(
      data => this.driver = data,
      () => this.complete = true,
      () => { /* this.viewForm(); */ this.complete = true; }
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  /* public editDriver(): void {
    const driverEdit = new Driver();
    driverEdit.name = this.FormGroup.get('CtrlName').value;
    driverEdit.surname = this.FormGroup.get('CtrlSurname').value;
    driverEdit.contacts = [];
    const cell = { code: 1, value: this.FormGroup.get('CtrlCell').value };
    const mail = { code: 3, value: this.FormGroup.get('CtrlMail').value };
    driverEdit.contacts.push(cell, mail);
    this.complete = false;
    this.subscription.push(this.driverService.editDriver(driverEdit).subscribe(
      () => this.snackBar.showMessage('DRIVERS.EDIT_SUCCESS', 'INFO'),
      () => this.complete = true,
      () => this.complete = true
    ));
  }

  private viewForm(): void {
    this.FormGroup = this.formBuilder.group({
      CtrlName: [this.driver.name, Validators.required],
      CtrlSurname: [this.driver.surname, Validators.required],
      CtrlCell: [this.findContactValue(1), Validators.required],
      CtrlMail: [this.findContactValue(3), Validators.email]
    });
  }

  private findContactValue(code: number): string {
    let res = '';
    this.driver.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  } */
}

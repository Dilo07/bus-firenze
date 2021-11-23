import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import CodiceFiscale from 'codice-fiscale-js';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-anagraphic-fleet-manager',
  templateUrl: './anagraphic-fleet-manager.component.html',
  styles: [
  ]
})
export class AnagraphicFleetManagerComponent implements OnInit {
  public FormGroup: FormGroup;
  public fleetManager: FleetManager;
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private fleetManagerService: FleetManagerService,
    private snackBar: SnackBar) { }

  ngOnInit(): void {
    this.complete = false;
    this.fleetManagerService.getFleetManagerInfo().subscribe(
      data => this.fleetManager = data,
      () => this.complete = true,
      () => {this.viewForm(); this.complete = true; }
    );
  }

  private viewForm(): void {
    this.FormGroup = this.formBuilder.group({
      CtrlName: [this.fleetManager.name, Validators.required],
      CtrlSurname: [this.fleetManager.surname, Validators.required],
      CtrlCF: [this.fleetManager.fiscalCode, [this.fiscaleCodeValidator]],
      CtrlpIva: [this.fleetManager.pIva, Validators.required],
      CtrlCompanyName: [this.fleetManager.companyName, Validators.required],
      CtrlCell: [this.findContactValue(1), Validators.required],
      CtrlOffice: [this.findContactValue(2)],
      CtrlMail: [this.findContactValue(3), Validators.email],
      CtrlAddress: [this.fleetManager.address, Validators.required],
      CtrlCity: [this.fleetManager.city, Validators.required],
      CtrlDistrict: [this.fleetManager.district, Validators.required],
      CtrlCAP: [this.fleetManager.cap, Validators.required],
    });
  }

  public updateFleetManager(): void {
    const fleetManagerEdit = this.generateFleetManager();
    this.complete = false;
    this.subscription.push(this.fleetManagerService.updateFleetManager(fleetManagerEdit).subscribe(
      () => this.snackBar.showMessage('FLEET-MANAGER.EDIT_SUCCESS', 'INFO'),
      () => this.complete = true,
      () => this.complete = true
    ));
  }

  private generateFleetManager(): FleetManager {
    const fleetManager = new FleetManager();

    fleetManager.id = this.fleetManager.id;
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

    const cell = { code: 1, value: this.FormGroup.get('CtrlCell').value };
    const office = { code: 2, value: this.FormGroup.get('CtrlOffice').value };
    const mail = { code: 3, value: this.FormGroup.get('CtrlMail').value };

    fleetManager.contacts.push(cell, office, mail);
    return fleetManager;
  }

  private findContactValue(code: number): string {
    let res = '';
    this.fleetManager.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

  private fiscaleCodeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    let cf: CodiceFiscale;
    if (control.value?.length === 16){
      try {
        cf = new CodiceFiscale(control.value);
        return null;
      } catch (error) {
        return { fiscalCode: true };
      }
    }else{
      return { fiscalCode: true };
    }
  }
}

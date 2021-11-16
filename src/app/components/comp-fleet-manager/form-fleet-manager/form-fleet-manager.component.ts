import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-form-fleet-manager',
  templateUrl: './form-fleet-manager.component.html',
  styleUrls: ['./form-fleet-manager.component.css']
})
export class FormFleetManagerComponent implements OnInit, OnDestroy {
  @Input() register = false;

  public data: FleetManager;
  public FormGroup: FormGroup;

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private fleetManagerService: FleetManagerService) {
    this.data = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data !== undefined && this.data !== null) {
      this.FormGroup = this.formBuilder.group({
        CtrlName: [this.data.name, Validators.required],
        CtrlSurname: [this.data.surname, Validators.required],
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

    } else {
      this.FormGroup = this.formBuilder.group({
        CtrlName: ['', Validators.required],
        CtrlSurname: ['', Validators.required],
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

    } else {
      const newFleetManager = this.generateFleetManager();
      this.subscription.push(this.fleetManagerService.insertFleetManager(newFleetManager).subscribe(
        () => { this.router.navigate(['../fleet-manager']); },
      ));
    }
  }

  public updateFleetManager(): void {
    const fleetManagerEdit = this.generateFleetManager();
    this.subscription.push(this.fleetManagerService.updateFleetManager(fleetManagerEdit).subscribe(
      () => { this.router.navigate(['../fleet-manager']); }
    ));
  }

  private generateFleetManager(): FleetManager {
    const fleetManager = new FleetManager();

    fleetManager.id = this.data?.id;
    fleetManager.name = this.FormGroup.get('CtrlName').value;
    fleetManager.surname = this.FormGroup.get('CtrlSurname').value;
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

}

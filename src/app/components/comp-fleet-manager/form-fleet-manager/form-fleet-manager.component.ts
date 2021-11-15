import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-form-fleet-manager',
  templateUrl: './form-fleet-manager.component.html',
  styleUrls: ['./form-fleet-manager.component.css']
})
export class FormFleetManagerComponent implements OnInit {
  @Input() register = false;

  public data: FleetManager;
  public FormGroup: FormGroup;

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

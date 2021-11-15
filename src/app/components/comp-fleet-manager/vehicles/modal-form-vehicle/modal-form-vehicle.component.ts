import { Component, Inject, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/components/domain/bus-firenze-domain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Nations } from 'src/app/components/domain/bus-firenze-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styles: [
  ]
})
export class ModalFormVehicleComponent implements OnInit {
  public nations = Nations;
  public FormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle ) { }

  ngOnInit(): void {
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data) {
      this.FormGroup = this.formBuilder.group({
        CtrlLpn: [this.data.lpn, Validators.required],
        CtrlLpnNat: [this.data.lpnNat, Validators.required],
        CtrlEuroClass: [this.data.euroClass, Validators.min(1)],
        CtrlNumAxis: [this.data.numAxis, Validators.min(1)],
        CtrlMaxWeight: [this.data.maxWeight, Validators.min(1)]
      });
    } else {
      this.FormGroup = this.formBuilder.group({
        CtrlLpn: ['', Validators.required],
        CtrlLpnNat: [''],
        CtrlManualLpnNat: [null],
        CtrlEuroClass: ['', Validators.min(1)],
        CtrlNumAxis: ['', Validators.min(1)],
        CtrlMaxWeight: ['', Validators.min(1)]
      });
    }
  }

}

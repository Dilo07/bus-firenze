import { Component, Inject, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/components/domain/bus-firenze-domain';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styles: [
  ]
})
export class ModalFormVehicleComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Vehicle
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}

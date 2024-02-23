import { Component, Input } from '@angular/core';
import { Vehicle } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './modal-vehicle-details.component.html',
  styles: [
  ]
})
export class ModalVehicleDetailsComponent {
  @Input() public vehicleInfo: Vehicle;

  constructor() { }


}

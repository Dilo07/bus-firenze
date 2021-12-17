import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Vehicle } from '../../domain/bus-firenze-domain';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-modal-vehicle-details',
  templateUrl: './modal-vehicle-details.component.html',
  styles: [
  ]
})
export class ModalVehicleDetailsComponent implements OnInit {
  private subscription: Subscription[] = [];
  public vehicleInfo: Vehicle;
  public complete: boolean;

  constructor(
    private fleetManagerService: VehicleService,
    @Inject(MAT_DIALOG_DATA) public data: {obuID: string, fleetId: number | null}) { }

  ngOnInit(): void {
    this.complete = false;
    this.subscription.push(this.fleetManagerService.getVehicleByObu(this.data.obuID, this.data.fleetId).subscribe((data: Vehicle) => {
      this.vehicleInfo = data;
    },
      () => this.complete = true,
      () => this.complete = true));
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Vehicle } from '../../domain/bus-firenze-domain';

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
    private fleetManagerService: FleetManagerService,
    @Inject(MAT_DIALOG_DATA) public obuId: string) { }

  ngOnInit(): void {
    this.complete = false;
    this.subscription.push(this.fleetManagerService.getVehicleByObu(this.obuId).subscribe((data: Vehicle) => {
      this.vehicleInfo = data;
    },
      () => this.complete = true,
      () => this.complete = true));
  }

}

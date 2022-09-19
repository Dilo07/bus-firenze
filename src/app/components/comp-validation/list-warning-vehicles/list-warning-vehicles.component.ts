import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-warning-vehicles',
  templateUrl: './list-warning-vehicles.component.html',
  styles: [
  ]
})
export class ListWarningVehiclesComponent implements OnChanges {
  @Input() idFleet: number;

  constructor(private vehicleService: VehicleService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getVehicles();
  }

  public getVehicles(): void {
    this.vehicleService.getVehicleWarning(this.idFleet).subscribe(
      (vehicle) => console.log(vehicle)
    );
  }

}

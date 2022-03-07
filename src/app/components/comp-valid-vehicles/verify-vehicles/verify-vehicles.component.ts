import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Vehicle } from '@npt/npt-obu';
import { Subscription } from 'rxjs';
import { VehicleService } from 'src/app/services/vehicle.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-verify-vehicles',
  templateUrl: './verify-vehicles.component.html',
  styles: [`
  .mat-elevation-z8 {
    width: 1200px;
    background-color: white;
    margin: 2px;
  }
  .mat-column-actions { display: table-column; text-align: end;}
  `
  ]
})
export class VerifyVehiclesComponent implements OnChanges, OnDestroy {
  @Input() idFleet: number;
  public dataSource = new MatTableDataSource<Vehicle>();
  public displayedColumns: string[] = ['id', 'lpn', 'lpnNat', 'actions'];

  private subscription: Subscription[] = [];

  constructor(
    private vehicleService: VehicleService
  ) { }

  ngOnChanges(): void {
    this.subscription.push(this.vehicleService.getVehiclesById(false, this.idFleet, '', true).subscribe(
      vehicles => this.dataSource.data = vehicles
    ));
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}

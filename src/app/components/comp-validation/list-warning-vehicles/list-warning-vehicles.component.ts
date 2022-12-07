import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-warning-vehicles',
  templateUrl: './list-warning-vehicles.component.html',
  styles: [`
  .mat-elevation-z8 {
    width: 870px;
    margin: 10px;
  }
  `
  ]
})
export class ListWarningVehiclesComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() idFleet: number;
  public dataSource = new MatTableDataSource<Vehicle>();
  public displayedColumns: string[] = ['id', 'lpn', 'lpnNat', 'obuId', 'associationDate'];

  private subscription: Subscription[] = [];

  constructor(private vehicleService: VehicleService) { }

  ngOnChanges(): void {
    this.getVehicles();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getVehicles(): void {
    this.subscription.push(this.vehicleService.getVehicleWarning(this.idFleet).subscribe(
      (vehicles) => (this.dataSource.data = vehicles, this.dataSource.sort = this.sort)
    ));
  }

}

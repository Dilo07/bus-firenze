import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { VehicleService } from 'src/app/services/vehicle.service';
import { VehicleWarning } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-warning-vehicles',
  templateUrl: './list-warning-vehicles.component.html',
  styles: [``]
})
export class ListWarningVehiclesComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() idFleet: number;
  public dataSource = new MatTableDataSource<VehicleWarning>();
  public vehicleListConnect: BehaviorSubject<VehicleWarning[]>;

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
      (vehicles) => {
        this.dataSource.data = vehicles;
        this.dataSource.sort = this.sort;
        this.vehicleListConnect = this.dataSource.connect();
      }
    ));
  }

}

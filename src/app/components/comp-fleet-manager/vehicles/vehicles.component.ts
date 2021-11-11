import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetManager, Vehicle } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: [`
  table {
    width: 100%;
  }
  `]
})
export class VehiclesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public fleetManager: FleetManager;
  public vehicleList = new MatTableDataSource<Vehicle>([]);
  public displayedColumns = ['id', 'plate', 'nat', 'euroClass', 'obuId'];

  constructor(private router: Router, private fleetManagerService: FleetManagerService) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    this.getVehiclesByManagerId(); // sia per fleet che op_movyon
  }

  public getVehiclesByManagerId(): void{
    this.fleetManagerService.getVehiclesById(true, this.fleetManager?.id).subscribe(data => {
      console.log(data);
      this.vehicleList.data = data;
      this.vehicleList.sort = this.sort;
    });
  }
}

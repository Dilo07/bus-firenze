import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetManager, Vehicle } from '../../domain/bus-firenze-domain';
import { ModalFormVehicleComponent } from './modal-form-vehicle/modal-form-vehicle.component';

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
  public displayedColumns = ['id', 'plate', 'nat', 'euroClass', 'obuId', 'actions'];
  public Search: FormGroup;
  public complete = true;

  constructor(
    private router: Router,
    private fleetManagerService: FleetManagerService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: ['']
    });
    this.getVehiclesByManagerId(); // sia per fleet che op_movyon
  }

  public getVehiclesByManagerId(): void {
    this.complete = false;
    const keyword = this.Search.get('CtrlSearch').value;
    this.fleetManagerService.getVehiclesById(true, this.fleetManager?.id, keyword).subscribe(data => {
      console.log(data);
      this.vehicleList.data = data;
      this.vehicleList.sort = this.sort;
    },
      () => this.complete = true,
      () => this.complete = true);
  }

  public addVehicle(): void {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '90%',
      height: '90%'
    });
  }

  public editVehicle(vehicle: Vehicle): void {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '90%',
      height: '90%',
      data: vehicle
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DriverService } from 'src/app/services/driver.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { FleetManager, Vehicle } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { AssociationDriversVehiclesComponent } from '../drivers/modal-association-drivers-vehicles/association-drivers-vehicles.component';
import { ModalFormVehicleComponent } from './modal-form-vehicle/modal-form-vehicle.component';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: [`
  table {
    width: 100%;
    background-color: beige;
  }
  .obuDisactive{
    opacity: 0.8;
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
    private snackBar: SnackBar,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: [''],
      onlyActive: [true]
    });
    this.getVehiclesByManagerId(); // sia per fleet che op_movyon
  }

  public getVehiclesByManagerId(): void {
    this.complete = false;
    const keyword = this.Search.get('CtrlSearch').value;
    const onlyActive = this.Search.get('onlyActive').value;
    this.vehicleService.getVehiclesById(onlyActive, this.fleetManager?.id, keyword).subscribe(data => {
      this.vehicleList.data = data;
      this.vehicleList.sort = this.sort;
    },
      () => this.complete = true,
      () => this.complete = true);
  }

  public addVehicle(): void {
    const dialogRef = this.dialog.open(ModalFormVehicleComponent, {
      width: '90%',
      height: '90%',
      data: { vehicle: null, fleetManagerId: this.fleetManager?.id }
    });
    dialogRef.afterClosed().subscribe((add) => {
      if (add) {
        this.getVehiclesByManagerId();
        this.resetSearchField();
      }
    });
  }

  public editVehicle(vEhicle: Vehicle): void {
    const dialogRef = this.dialog.open(ModalFormVehicleComponent, {
      width: '90%',
      height: '90%',
      data: { vehicle: vEhicle, fleetManagerId: this.fleetManager?.id }
    });
    dialogRef.afterClosed().subscribe((edit) => {
      if (edit) {
        this.getVehiclesByManagerId();
        this.resetSearchField();
      }
    });
  }

  public deleteVehicle(vehicleId: number): void{
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: 'VEHICLE.DELETE_CONFIRM' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
          this.vehicleService.deleteVehicle(vehicleId).subscribe(
            () => this.snackBar.showMessage('VEHICLE.DELETE_SUCCESS', 'INFO'),
            () => null,
            () => {
              this.getVehiclesByManagerId();
              this.resetSearchField();
            });
      }
    });
  }

  public associationDriver(vehicleId: number): void{
    this.driverService.getDriversByVehicle(vehicleId, this.fleetManager?.id).subscribe(
      drivers => {
        const dialogRef = this.dialog.open(AssociationDriversVehiclesComponent, {
          width: '80%',
          height: '80%',
          data: {driverVehicle: drivers, isDriver: false},
          autoFocus: false
        });
      });
  }

  private resetSearchField(): void {
    this.Search.patchValue({
      CtrlSearch: ''
    });
  }

}

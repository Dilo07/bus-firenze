import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { FleetManager, Vehicle } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
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
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private fleetManagerService: FleetManagerService,
    private vehicleService: VehicleService,
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
      data: { fleetManagerId: this.fleetManager.id }
    });
    dialogRef.afterClosed().subscribe((add) => {
      if (add) {
        this.getVehiclesByManagerId();
        this.resetSearchField();
      }
    });
  }

  public editVehicle(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(ModalFormVehicleComponent, {
      width: '90%',
      height: '90%',
      data: vehicle
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
            () => this.showMessage('VEHICLE.DELETE_SUCCESS', 'SUCCESS'),
            () => null,
            () => {
              this.getVehiclesByManagerId();
              this.resetSearchField();
            });
      }
    });
  }

  private resetSearchField(): void {
    this.Search.patchValue({
      CtrlSearch: ''
    });
  }

  private showMessage(i18nKey: string, level: string): void {
    this.snackBar.open(this.translate.instant(i18nKey),
      '✖',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: [level]
      });
  }
}

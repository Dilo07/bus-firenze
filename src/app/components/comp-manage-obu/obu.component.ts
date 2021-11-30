import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ObuService } from 'src/app/services/obu.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { Obu, Vehicle } from '../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModalObuComponent } from './modal-obu/modal-obu.component';
import { ModalPlateComponent } from './modal-plate/modal-plate.component';

@Component({
  selector: 'app-obu',
  templateUrl: './obu.component.html',
  styles: [
  ]
})
export class ObuComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public assignObuEnabled = false;
  public changeObuEnabled = false;
  public changePlateEnabled = false;
  public removeObuEnabled = false;
  public complete = true;
  public vehicleList = new MatTableDataSource<Vehicle>();
  public displayedColumns = ['id', 'plate', 'nat', 'euroClass', 'obuId', 'actions'];
  public Search: FormGroup;

  private subscription: Subscription[] = [];

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private vehicleService: VehicleService,
    private obuService: ObuService,
    private snackBar: SnackBar,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: ['']
    });
    this.callTableInstaller();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  private callTableInstaller(): void {
    this.assignObuEnabled = this.router.url === '/manage-obu/assign-obu';
    this.changeObuEnabled = this.router.url === '/manage-obu/change-obu';
    this.changePlateEnabled = this.router.url === '/manage-obu/change-plate';
    this.removeObuEnabled = this.router.url === '/manage-obu/remove-obu';
    // Per la pagina assign-obu servono i veicoli non associati
    // Per le altre quelli associati
    this.getVehiclesInstaller(!this.assignObuEnabled);
  }

  public getVehiclesInstaller(associated: boolean): void {
    const keyword = this.Search.get('CtrlSearch').value;
    this.complete = false;
    this.subscription.push(this.vehicleService.getVehicles(associated, keyword).subscribe(
      (data) => {
        this.vehicleList.data = data;
        this.vehicleList.sort = this.sort;
        this.vehicleList.paginator = this.paginator;
      },
      () => this.complete = true,
      () => this.complete = true));
  }

  public addObu(VehicleId: number, Lpn: string, LpnNat: string): void {
    const dialogRef = this.dialog.open(ModalObuComponent, {
      width: '70%',
      height: '70%',
      data: { vehicleId: VehicleId, lpn: Lpn, lpnNat: LpnNat }
    });
    // chiama il modal form in caso si edit aggiorna la table chiamando il service
    dialogRef.afterClosed().subscribe((add) => {
      if (add) {
        this.resetSearchField();
        this.getVehiclesInstaller(false);
      }
    });
  }

  public changeObu(VehicleId: number, ObuId: string, Lpn: string, LpnNat: string): void {
    const dialogRef = this.dialog.open(ModalObuComponent, {
      width: '70%',
      height: '70%',
      data: { vehicleId: VehicleId, obuId: ObuId, lpn: Lpn, lpnNat: LpnNat }
    });
    // chiama il modal form in caso si edit aggiorna la table chiamando il service
    dialogRef.afterClosed().subscribe((edit) => {
      if (edit) {
        this.resetSearchField();
        this.getVehiclesInstaller(true);
      }
    });
  }

  public removeObu(vehicleId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: 'OBU.REMOVE CONFIRM' }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.subscription.push(
          this.obuService.deleteObu(vehicleId).subscribe(
            () => this.snackBar.showMessage('OBU.REMOVE_SUCCESS', 'ERROR'),
            () => null,
            () => {
              this.resetSearchField();
              this.getVehiclesInstaller(true);
            }));
      }
    });
  }

  public changePlate(vehicleId: number, obuId: string, Lpn: string, LpnNat: string): void {
    const obu = new Obu();
    obu.vehicleId = vehicleId;
    obu.obuId = obuId;
    const dialogRef = this.dialog.open(ModalPlateComponent, {
      width: '70%',
      height: '70%',
      data: { Obu: obu, lpn: Lpn, lpnNat: LpnNat }
    });
    // chiama il modal form in caso si edit aggiorna la table chiamando il service
    dialogRef.afterClosed().subscribe((edit) => {
      if (edit) {
        this.snackBar.showMessage('OBU.CHANGE_PLATE_SUCCESS', 'INFO');
        this.resetSearchField();
        this.getVehiclesInstaller(true);
      }
    });
  }

  private resetSearchField(): void {
    this.Search.patchValue({
      CtrlSearch: ''
    });
  }

}

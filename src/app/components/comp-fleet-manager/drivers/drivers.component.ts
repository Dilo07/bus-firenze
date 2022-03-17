import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DriverService } from 'src/app/services/driver.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { Driver, FleetManager } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { AssociationDriversVehiclesComponent } from './modal-association-drivers-vehicles/association-drivers-vehicles.component';
import { FormDriverComponent } from './modal-form-driver/form-driver.component';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styles: [`
  @media(min-width: 1180px) {
    .mat-column-name { max-width: 20%;}
    .mat-column-surname { max-width: 20%;}
    .mat-column-e-mail { max-width: 20%;}
    .mat-column-mobile { max-width: 20%;}
    .mat-column-actions { max-width: 20%; display: table-column;}
  }
  `
  ]
})
export class DriversComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  public search: FormGroup;
  public fleetManagerId: number;
  public dataSource = new MatTableDataSource<Driver>();
  public displayedColumns = ['name', 'surname', 'e-mail', 'mobile', 'actions'];
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private driverService: DriverService,
    private formBuilder: FormBuilder) {
    this.fleetManagerId = this.router.getCurrentNavigation()?.extras.state?.fleetManagerId as number;
  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
    });
    this.getDrivers();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getDrivers(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch').value;
    this.subscription.push(
      this.driverService.getDrivers(keyword, this.fleetManagerId).subscribe(
        data => {
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        () => this.complete = true,
        () => this.complete = true
      ));
  }

  public addDriver(): void {
    const dialogRef = this.dialog.open(FormDriverComponent, {
      width: '90%',
      height: '90%',
      data: { driver: null, fleetManagerId: this.fleetManagerId }
    });
    dialogRef.afterClosed().subscribe((add) => {
      if (add) {
        this.getDrivers();
        this.resetSearchField();
      }
    });
  }

  public editDriver(dRiver: Driver): void {
    const dialogRef = this.dialog.open(FormDriverComponent, {
      width: '90%',
      height: '90%',
      data: { driver: dRiver, fleetManagerId: this.fleetManagerId }
    });
    dialogRef.afterClosed().subscribe((edit) => {
      if (edit) {
        this.getDrivers();
        this.resetSearchField();
      }
    });
  }

  public deleteDriver(idDriver: number): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: 'DRIVERS.DELETE_CONFIRM' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.driverService.deleteDriver(idDriver, this.fleetManagerId).subscribe(
          () => this.snackBar.showMessage('DRIVERS.DELETE_SUCCESS', 'INFO'),
          () => null,
          () => {
            this.getDrivers();
            this.resetSearchField();
          });
      }
    });
  }

  public associationVehicle(iddriver: number): void {
    this.subscription.push(
      this.driverService.getVehiclesByDriver(iddriver, this.fleetManagerId).subscribe(
        vehicles => {
          const dialogRef = this.dialog.open(AssociationDriversVehiclesComponent, {
            width: '80%',
            height: '80%',
            data: {driverVehicle: vehicles, idDriver: iddriver, fleetManagerId: this.fleetManagerId},
            autoFocus: false
          });
        }));
  }

  private resetSearchField(): void {
    this.search.patchValue({
      ctrlSearch: ''
    });
  }
}

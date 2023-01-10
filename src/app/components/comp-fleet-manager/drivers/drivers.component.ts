import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackBar } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { DriverService } from 'src/app/services/driver.service';
import { Driver } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { AssociationDriversVehiclesComponent } from './modal-association-drivers-vehicles/association-drivers-vehicles.component';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styles: [`
  ::ng-deep .menu-color {
    background: #E4F1F5;
  }
  @media(min-width: 1180px) {
    .mat-column-name { max-width: 20%;}
    .mat-column-surname { max-width: 20%;}
    .mat-column-e-mail { max-width: 20%;}
    .mat-column-mobile { max-width: 20%;}
    .mat-column-actions { max-width: 20%; display: table-column;}
  }
  .cardDriver {
    background-color: #313775;
  }
  .white {
    color: white;
  }
  .icon-car:before {
    color: white;
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
  private desktopQuery: MediaQueryList;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private driverService: DriverService,
    private formBuilder: FormBuilder,
    private media: MediaMatcher) {
    this.fleetManagerId = this.router.getCurrentNavigation()?.extras.state?.fleetManagerId as number;
    this.desktopQuery = this.media.matchMedia('(min-width: 768px)'); // se è un tablet o schermo grande
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
      this.driverService.getDrivers(keyword, this.fleetManagerId).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
  }

  public deleteDriver(idDriver: number): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: this.desktopQuery.matches ? '30%' : '100%',
      height: this.desktopQuery.matches ? '20%' : '30%',
      data: { text: 'DRIVERS.DELETE_CONFIRM' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.driverService.deleteDriver(idDriver, this.fleetManagerId).subscribe({
          next: () => this.snackBar.showMessage('DRIVERS.DELETE_SUCCESS', 'INFO'),
          complete: () => {
            this.getDrivers();
            this.resetSearchField();
          }
        });
      }
    });
  }

  public associationVehicle(idDriver: number): void {
    this.subscription.push(
      this.driverService.getVehiclesByDriver(idDriver, this.fleetManagerId).subscribe(
        vehicles => {
          const dialogRef = this.dialog.open(AssociationDriversVehiclesComponent, {
            width: '80%',
            height: this.desktopQuery.matches ? '60%' : '80%',
            data: { driverVehicle: vehicles, idDriver: idDriver, fleetManagerId: this.fleetManagerId },
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

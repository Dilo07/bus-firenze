import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Breadcrumb, SnackBar } from '@npt/npt-template';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DriverService } from 'src/app/services/driver.service';
import { Driver, FleetManager } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModalNewDriverComponent } from './details-form-driver/modal-new-driver/modal-new-driver.component';

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
  `
  ]
})
export class DriversComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public search: FormGroup;
  public fleetManager: FleetManager;
  public dataSource = new MatTableDataSource<Driver>();
  public driverListConnect: BehaviorSubject<Driver[]>;
  public breadCrumb: Breadcrumb[];
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
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    if (this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb as FleetManager) {
      this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb.fleetManager;
    };
    this.desktopQuery = this.media.matchMedia('(min-width: 768px)'); // se è un tablet o schermo grande
  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
    });
    this.getDrivers();
    if (this.fleetManager) { // solo se op movyon o admin
      this.breadCrumb = [
        {
          label: 'Fleet manager',
          url: '/manage'
        },
        {
          label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
          url: '../selection-card',
          state: { fleetManager: this.fleetManager }
        },
        {
          label: 'DRIVERS.TITLE',
          url: ''
        }
      ];
    }
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
      this.driverService.getDrivers(keyword, this.fleetManager?.id).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.driverListConnect = this.dataSource.connect();
          this.dataSource.paginator = this.paginator;
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
  }

  public deleteDriver(idDriver: number): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: this.desktopQuery.matches ? '30%' : '100%',
      height: this.desktopQuery.matches ? '30%' : '30%',
      data: { text: 'DRIVERS.DELETE_CONFIRM' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.driverService.deleteDriver(idDriver, this.fleetManager?.id).subscribe({
          next: () => this.snackBar.showMessage('DRIVERS.DELETE_SUCCESS', 'INFO'),
          complete: () => {
            this.getDrivers();
            this.resetSearchField();
          }
        });
      }
    });
  }

  public openModal(): void {
    const dialogRef = this.dialog.open(ModalNewDriverComponent, {
      width: '60%',
      height: '70%',
      data: { fleetManager: this.fleetManager, countDriver: this.dataSource.data.length },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) { this.getDrivers(); }
    });
  }

  private resetSearchField(): void {
    this.search.patchValue({
      ctrlSearch: ''
    });
  }
}

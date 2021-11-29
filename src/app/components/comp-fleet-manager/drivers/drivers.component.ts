import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DriverService } from 'src/app/services/driver.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { Driver, FleetManager } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { FormDriverComponent } from './modal-form-driver/form-driver.component';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styles: [
  ]
})
export class DriversComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  public Search: FormGroup;
  public fleetManager: FleetManager;
  public dataSource = new MatTableDataSource<Driver>();
  public displayedColumns = ['name', 'surname', 'e-mail', 'action'];
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private driverService: DriverService,
    private formBuilder: FormBuilder) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: [''],
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
    const keyword = this.Search.get('CtrlSearch').value;
    this.subscription.push(
      this.driverService.getDrivers(keyword, this.fleetManager?.id).subscribe(
        data => {
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
        },
        () => this.complete = true,
        () => this.complete = true
      ));
  }

  public addDriver(): void {
    const dialogRef = this.dialog.open(FormDriverComponent, {
      width: '90%',
      height: '90%',
      /* disableClose: true, */
      data: { driver: null, fleetManagerId: this.fleetManager?.id }
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
      data: { driver: dRiver, fleetManagerId: this.fleetManager?.id }
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
        this.driverService.deleteDriver(idDriver, this.fleetManager?.id).subscribe(
          () => this.snackBar.showMessage('DRIVERS.DELETE_SUCCESS', 'INFO'),
          () => null,
          () => {
            this.getDrivers();
            this.resetSearchField();
          });
      }
    });
  }

  public associationVehicle(idDriver: number): void {
    this.subscription.push(
      this.driverService.getVehiclesByDriver(idDriver, this.fleetManager?.id).subscribe(
        data => console.log(data)));
  }

  public findContactValue(fleetManager: FleetManager, code: number): string {
    let res = '';
    fleetManager.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

  private resetSearchField(): void {
    this.Search.patchValue({
      CtrlSearch: ''
    });
  }
}

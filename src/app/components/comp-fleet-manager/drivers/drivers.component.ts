import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DriverService } from 'src/app/services/driver.service';
import { Driver, FleetManager } from '../../domain/bus-firenze-domain';
import { FormDriverComponent } from './modal-form-driver/form-driver.component';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styles: [
  ]
})
export class DriversComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public Search: FormGroup;
  public fleetManager: FleetManager;
  public dataSource = new MatTableDataSource<Driver>();
  public displayedColumns = ['name', 'surname', 'e-mail'];
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
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
      data: {driver: null, fleetManagerId: this.fleetManager.id}
    });
    dialogRef.afterClosed().subscribe((add) => {
      if (add) {
        this.getDrivers();
        this.resetSearchField();
      }
    });
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

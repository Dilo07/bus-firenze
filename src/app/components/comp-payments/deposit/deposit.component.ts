import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Breadcrumb, FileViewer, SnackBar } from '@npt/npt-template';
import { Observable, Subscription } from 'rxjs';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DepositType, FleetManager, Vehicle } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styles: [`
  table { width: 100%; }
  @media(min-width: 1180px) {
  .mat-column-id { max-width: 10%}
  .mat-column-vehicleState { max-width: 10%}
  .mat-column-plate { max-width: 10%}
  .mat-column-nat { max-width: 5%}
  .mat-column-depositDocument { max-width: 13%}
  .mat-column-requestDocument { max-width: 13%}
  .mat-column-testing { max-width: 18%}
  .mat-column-obuId { max-width: 20%}
  }
  .icon-assignment-grey:before {
    color: grey;
    font-weight: bold;
  }
  `
  ]
})
export class DepositComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public fleetManager: FleetManager;
  public vehicleList = new MatTableDataSource<Vehicle>([]);
  public vehicleListConnect: Observable<Vehicle[]>;
  public displayedColumns = ['id', 'vehicleState', 'plate', 'nat', 'depositDocument', 'requestDocument', 'testing', 'obuId'];
  public src: FileViewer = { type: '', url: '', fileName: '' };
  public search: FormGroup;
  public complete = true;
  public breadCrumb: Breadcrumb[] = [];

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private snackBar: SnackBar,
    private formBuilder: FormBuilder
  ) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    if (this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb as FleetManager) {
      this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb;
    };
  }

  async ngOnInit(): Promise<void> {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlViewAll: [false]
    });
    this.breadCrumb = [
      {
        label: 'MENU.Payments',
        url: '/payments'
      },
    ];
    if (this.fleetManager) { // ruolo admin
      this.breadCrumb.push(
        {
          label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
          url: '../selection',
          state: this.fleetManager
        },
        {
          label: 'MENU.Deposit',
          url: ''
        });
    } else { // ruolo fleet manager
      this.breadCrumb.push({
        label: 'MENU.Deposit',
        url: ''
      });
    }
    this.getVehicle();
  }

  public getVehicle(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch').value;
    const viewAll = this.search.get('ctrlViewAll').value;
    this.subscription.push(this.vehicleService.getVehicleDeposit(viewAll, this.fleetManager?.id, keyword).subscribe({
      next: vehicles => (
        this.vehicleList.data = vehicles,
        this.vehicleListConnect = this.vehicleList.connect(),
        this.vehicleList.sort = this.sort,
        this.vehicleList.paginator = this.paginator),
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }


  public uploadDeposit(vehicleId: number, event: any, depositType: DepositType): void {
    this.complete = false;
    const file = event.target.files[0];
    const size = event.target.files[0].size;
    if (size > 2097152) { // dimensione massima
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
      this.complete = true;
    } else {
      this.subscription.push(this.vehicleService.uploadDeposit(vehicleId, depositType, file, this.fleetManager?.id).subscribe({
        next: () => this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO'),
        error: () => this.complete = true,
        complete: () => { this.getVehicle(); this.complete = true; }
      }));
    }
  }

}

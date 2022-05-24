import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BillingItemsService } from 'src/app/services/billing-items.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { PenalInfo, Vehicle } from '../../domain/bus-firenze-domain';
import { ModalPenalComponent } from './modal-penal/modal-penal.component';

@Component({
  selector: 'app-penalties',
  templateUrl: './penalties.component.html',
  styles: [`
  @media(min-width: 1180px) {
    .mat-column-actions { display: table-column;}
  }
  `
  ]
})
export class PenaltiesComponent implements OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public viewFleetTable = true;
  public dataSource = new MatTableDataSource<Vehicle>();
  public displayedColumns = ['id', 'plate', 'nat', 'obuId', 'actions'];
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private vehicleService: VehicleService,
    private billingItemService: BillingItemsService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getVehiclesByManagerId(fm: number): void {
    this.viewFleetTable = false;
    this.complete = false;
    this.vehicleService.getVehiclesById(false, fm).subscribe(
      vehicles => (this.dataSource.data = vehicles, this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator),
      () => this.viewFleetTable = true,
      () => this.complete = true
    );
  }

  public modalPenal(vehicleid: number, fmId: number): void {
    const dialogRef = this.dialog.open(ModalPenalComponent, {
      width: '50%',
      height: '50%',
      data: { vehicleId: vehicleid, fleetId: fmId },
      autoFocus: false
    });
    this.subscription.push(dialogRef.afterClosed().subscribe(
      (penal: PenalInfo) => {
        if (penal) { this.addPenal(penal.penalType, fmId, vehicleid, penal.date); }
      }
    ));
  }

  private addPenal(penalType: number, fmId: number, vehicleId: number, date: string): void {
    this.billingItemService.addPenal(penalType, fmId, vehicleId, date).subscribe();
  }
}

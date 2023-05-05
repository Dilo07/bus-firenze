import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { AddPenal, FleetManager, Vehicle } from 'src/app/components/domain/bus-firenze-domain';
import { BillingItemsService } from 'src/app/services/billing-items.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { ModalPenalComponent } from '../modal-penal/modal-penal.component';

@Component({
  selector: 'app-add-penalties',
  templateUrl: './add-penalties.component.html',
  styles: [`
  .mat-elevation-z8 { margin: 20px; }
  @media(min-width: 1180px) {
    .mat-column-actions { display: table-column;}
  }
  `
  ]
})
export class AddPenaltiesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() fleetManager: FleetManager;
  @Input() keyword: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public viewFleetTable = true;
  public dataSource = new MatTableDataSource<Vehicle>();
  public displayedColumns = ['id', 'plate', 'nat', 'obuId', 'actions'];
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private vehicleService: VehicleService,
    private billingItemService: BillingItemsService
  ) { }

  ngOnInit(): void {
    this.getVehiclesByManagerId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.keyword.firstChange) {
      this.getVehiclesByManagerId();
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getVehiclesByManagerId(): void {
    this.viewFleetTable = false;
    this.complete = false;
    this.subscription.push(this.vehicleService.getVehiclesById(true, this.fleetManager.id, this.keyword).subscribe({
      next: (vehicles) => (this.dataSource.data = vehicles, this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator),
      error: () => this.viewFleetTable = true,
      complete: () => this.complete = true
    }));
  }

  public modalPenal(vehicleid: number, fmId: number): void {
    const dialogRef = this.dialog.open(ModalPenalComponent, {
      width: '50%',
      height: '80%',
      data: { vehicleId: vehicleid, fleetId: fmId },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(
      (penal: AddPenal) => {
        if (penal) { this.addPenal(penal.penalType, fmId, vehicleid, penal.date); }
      }
    );
  }

  private addPenal(penalType: number, fmId: number, vehicleId: number, date: string): void {
    this.subscription.push(this.billingItemService.addPenal(penalType, fmId, vehicleId, date).subscribe({
      complete: () => this.snackBar.showMessage('PENALTIES.SUCCESS', 'INFO')
    }));
  }

}

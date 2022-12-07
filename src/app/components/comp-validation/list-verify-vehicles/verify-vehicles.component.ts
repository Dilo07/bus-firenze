import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackBar } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DocumentVehicle, FleetManager, Vehicle } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-verify-vehicles',
  templateUrl: './verify-vehicles.component.html',
  styles: [`
  .mat-elevation-z8 {
    width: 870px;
    margin: 10px;
  }
  @media(min-width: 1180px) {
    .mat-column-id { max-width: 10%}
    .mat-column-lpn { max-width: 20%}
    .mat-column-lpnNat { max-width: 20%}
    .mat-column-type { max-width: 20%}
    .mat-column-actions { max-width: 20%; display: table-column; text-align: end;}
  }
  .icon-assignment-grey:before {
    color: grey;
    font-weight: bold;
  }
  `
  ]
})
export class VerifyVehiclesComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() fleet: FleetManager;
  @Input() disableViewPdf: boolean;
  @Output() public callRefreshTableFleet = new EventEmitter();
  @Output() public viewDeposit = new EventEmitter<{ vehicleId: number; documents: DocumentVehicle[] }>();
  @Output() public viewCertificate = new EventEmitter<{ vehicleId: number; certificateId: number }>();
  public dataSource = new MatTableDataSource<Vehicle>();
  public displayedColumns: string[] = ['id', 'lpn', 'lpnNat', 'certificateId', 'type', 'actions'];

  private subscription: Subscription[] = [];

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private router: Router
  ) { }

  ngOnChanges(): void {
    this.getVehicles();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public validVehicle(vehicleId: number, documents: DocumentVehicle[]): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: 'VEHICLE.VALID_CONFIRM' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(
      confirm => {
        if (confirm) {
          let depositType: string;
          documents.map(document => {
            if (!document.valid) { depositType = document.type; }
          });
          this.subscription.push(this.vehicleService.validVehicle(this.fleet.id, vehicleId, depositType, true).subscribe({
            next: () => this.snackBar.showMessage('VEHICLE.VALID_SUCCESS', 'INFO'),
            complete: () => this.getVehicles()
          }));
        }
      }
    );
  }

  public verifyVehicle(lpn: string): void {
    this.router.navigate(['../manage/vehicles'], { state: { fleetManager: this.fleet, vehicleLpn: lpn } });
  }

  private getVehicles(): void {
    this.subscription.push(this.vehicleService.getVehicleDeposit(true, this.fleet.id, '', true).subscribe(
      vehicles => {
        this.dataSource.data = vehicles;
        this.dataSource.sort = this.sort;
        if (this.dataSource.data.length === 0) {
          this.callRefreshTableFleet.emit();
        }
      }
    ));
  }

}

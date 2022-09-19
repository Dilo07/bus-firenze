import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DocumentVehicle, Vehicle } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-verify-vehicles',
  templateUrl: './verify-vehicles.component.html',
  styles: [`
  .mat-elevation-z8 {
    width: 870px;
    background-color: white;
    margin: 10px;
  }
  @media(min-width: 1180px) {
    .mat-column-id { max-width: 10%}
    .mat-column-lpn { max-width: 20%}
    .mat-column-lpnNat { max-width: 20%}
    .mat-column-type { max-width: 20%}
    .mat-column-actions { max-width: 20%; display: table-column; text-align: end;}
  }
  `
  ]
})
export class VerifyVehiclesComponent implements OnChanges, OnDestroy {
  @Input() idFleet: number;
  @Input() disableViewPdf: boolean;
  @Output() public callRefreshTableFleet = new EventEmitter();
  @Output() public viewDeposit = new EventEmitter<{vehicleId: number; documents: DocumentVehicle[]}>();
  @Output() public viewCertificate = new EventEmitter<{vehicleId: number; certificateId: number}>();
  public dataSource = new MatTableDataSource<Vehicle>();
  public displayedColumns: string[] = ['id', 'lpn', 'lpnNat', 'certificateId', 'type', 'actions'];

  private subscription: Subscription[] = [];

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private snackBar: SnackBar
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
          this.subscription.push(this.vehicleService.validVehicle(this.idFleet, vehicleId, depositType, true).subscribe(
            () => this.snackBar.showMessage('VEHICLE.VALID_SUCCESS', 'INFO'),
            () => null,
            () => this.getVehicles()
          ));
        }
      }
    );
  }

  private getVehicles(): void {
    this.subscription.push(this.vehicleService.getVehicleDeposit(true, this.idFleet, '', true).subscribe(
      vehicles => {
        this.dataSource.data = vehicles;
        if(this.dataSource.data.length === 0){
          this.callRefreshTableFleet.emit();
        }
      }
    ));
  }

}

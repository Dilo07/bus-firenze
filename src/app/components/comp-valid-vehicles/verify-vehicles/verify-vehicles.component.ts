import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Vehicle } from '@npt/npt-obu';
import { SnackBar } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { ValidVehicleService } from 'src/app/services/valid-vehicle.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DEPOSIT_TYPE } from '../../domain/bus-firenze-constants';
import { DocumentVehicle } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-verify-vehicles',
  templateUrl: './verify-vehicles.component.html',
  styles: [`
  .mat-elevation-z8 {
    width: 1200px;
    background-color: white;
    margin: 2px;
  }
  .mat-column-actions { display: table-column; text-align: end;}
  `
  ]
})
export class VerifyVehiclesComponent implements OnChanges, OnDestroy {
  @Input() idFleet: number;
  public dataSource = new MatTableDataSource<Vehicle>();
  public displayedColumns: string[] = ['id', 'lpn', 'lpnNat', 'actions'];
  public src: { type: string, url: string | ArrayBuffer } = { type: '', url: '' };

  private depositType = DEPOSIT_TYPE;
  private subscription: Subscription[] = [];

  constructor(
    private vehicleService: VehicleService,
    private vehicleValidService: ValidVehicleService,
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

  public validVehicle(vehicleId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: 'VEHICLE.VALID_CONFIRM' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this.subscription.push(this.vehicleValidService.validVehicle(this.idFleet, vehicleId, this.depositType.DEPOSIT, true).subscribe(
            () => this.snackBar.showMessage('VEHICLE.VALID_SUCCESS', 'INFO'),
            () => null,
            () => this.getVehicles()
          ));
        }
      }
    );
  }

  public viewDeposit(vehicleId: number, documents: DocumentVehicle[]): void {
    let depositId: number;
    documents.map(document => {
      if (document.type === 'deposit') { depositId = document.fileId; }
    });
    this.subscription.push(this.vehicleService.getDeposit(vehicleId, this.depositType.DEPOSIT, depositId)
      .subscribe((data: HttpResponse<Blob>) => {
        if (data.body.type === 'application/pdf') { // se è un pdf
          const Url = window.URL.createObjectURL(data.body);
          this.src = { url: Url, type: data.body.type };
        } else { // altrimenti se è un'immagine
          const reader = new FileReader();
          reader.readAsDataURL(data.body);
          reader.onload = () => {
            this.src = { url: reader.result, type: data.body.type };
          };
        }
      }));
  }

  private getVehicles(): void{
    this.subscription.push(this.vehicleService.getVehiclesById(false, this.idFleet, '', true).subscribe(
      vehicles => this.dataSource.data = vehicles
    ));
  }

}

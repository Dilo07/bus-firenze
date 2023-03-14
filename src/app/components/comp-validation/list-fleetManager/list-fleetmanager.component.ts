import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FileViewer, ViewFileModalComponent } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DepositType, DocumentVehicle, FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-list-fleetmanager',
  templateUrl: './list-fleetmanager.component.html',
  styles: [`
  table { width: 100%; }
  @media(min-width: 1180px) {
    .mat-column-expandButton { max-width: 10% }
    .mat-column-id { max-width: 10%}
    .mat-column-name { max-width: 10%}
    .mat-column-surname { max-width: 10%}
    .mat-column-mobile { max-width: 20%}
    .mat-column-mail { max-width: 20%}
  }
  `],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListFleetmanagerComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() depositWarning: boolean;
  public dataSource = new MatTableDataSource<FleetManager>();
  public displayedColumns = ['expandButton', 'id', 'name', 'surname', 'mobile', 'mail'];
  public expandedElement: FleetManager | null;
  public complete = true;
  public src: FileViewer = { type: '', url: '', fileName: '' };

  private subscription: Subscription[] = [];

  constructor(
    private fleetService: FleetManagerService,
    private vehicleService: VehicleService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.callFleetDeposit();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public callFleetDeposit(): void {
    this.complete = false;
    this.fleetService.getFleetDeposit(this.depositWarning).subscribe({
      next: fleetM => (this.dataSource.data = fleetM, this.dataSource.paginator = this.paginator, this.dataSource.sort = this.sort),
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

  public viewDeposit(event: { vehicleId: number; documents: DocumentVehicle[] }): void {
    let depositId: number;
    let depositType: DepositType;
    event.documents.map((document: DocumentVehicle) => {
      if (!document.valid) { depositId = document.fileId; depositType = document.type; }
    });
    this.complete = false;
    this.src.type = null;
    this.subscription.push(this.vehicleService.getDeposit(event.vehicleId, depositType, depositId)
      .subscribe({
        next: (data: HttpResponse<Blob>) => {
          if (data.body.type === 'application/pdf') { // se è un pdf
            const objectUrl = window.URL.createObjectURL(data.body);
            const contentDispositionHeader = data.headers.get('Content-Disposition');
            const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
            this.dialog.open(ViewFileModalComponent, {
              width: '50%',
              height: '90%',
              autoFocus: false,
              data: { url: objectUrl, type: data.body.type, fileName: filename }
            });
          } else { // altrimenti se è un'immagine
            const reader = new FileReader();
            reader.readAsDataURL(data.body);
            reader.onload = () => {
              this.dialog.open(ViewFileModalComponent, {
                width: '50%',
                height: '90%',
                autoFocus: false,
                data: { url: reader.result, type: data.body.type, fileName: '' }
              });
            };
          }
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
  }

  public viewCertificate(event: { vehicleId: number; certificateId: number }): void {
    this.complete = false;
    this.src.type = null;
    this.subscription.push(this.vehicleService.getCertificateFile(event.vehicleId, event.certificateId)
      .subscribe({
        next: (data: HttpResponse<Blob>) => {
          if (data.body.type === 'application/pdf') { // se è un pdf
            const objectUrl = window.URL.createObjectURL(data.body);
            const contentDispositionHeader = data.headers.get('Content-Disposition');
            const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
            this.dialog.open(ViewFileModalComponent, {
              width: '50%',
              height: '90%',
              autoFocus: false,
              data: { url: objectUrl, type: data.body.type, fileName: filename }
            });
          } else { // altrimenti se è un'immagine
            const reader = new FileReader();
            reader.readAsDataURL(data.body);
            reader.onload = () => {
              this.dialog.open(ViewFileModalComponent, {
                width: '50%',
                height: '90%',
                autoFocus: false,
                data: { url: reader.result, type: data.body.type, fileName: '' }
              });
            };
          }
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
  }

  public uploadCertificate(vehicleId: number, event: any, fleetManagerId: number): void {
    this.complete = false;
    const file = event.target.files[0];
    const type = event.target.files[0].type;
    const size = event.target.files[0].size;
    if (type !== 'application/pdf') { // formato errato
      /* this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR'); */
      this.complete = true;
    } else if (size > 2097152) { // dimensione massima
      /* this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR'); */
      this.complete = true;
    } else {
      this.subscription.push(this.vehicleService.uploadCertificate(vehicleId, file, fleetManagerId).subscribe(
        /* () => this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO') */
        () => this.complete = true,
        () => this.complete = true
      ));
    }
  }
}

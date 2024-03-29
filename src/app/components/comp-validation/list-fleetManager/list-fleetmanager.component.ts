import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Breadcrumb, FileViewer, ViewFileModalComponent } from '@npt/npt-template';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DepositType, DocumentVehicle, FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-list-fleetmanager',
  templateUrl: './list-fleetmanager.component.html',
  styles: [` `]
})
export class ListFleetmanagerComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public depositWarning: boolean;
  public dataSource = new MatTableDataSource<FleetManager>();
  public fleetListConnect: BehaviorSubject<FleetManager[]>;
  public complete = true;
  public src: FileViewer = { type: '', url: '', fileName: '' };
  public breadCrumb: Breadcrumb[] = [];

  private subscription: Subscription[] = [];

  constructor(
    private fleetService: FleetManagerService,
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.depositWarning = this.router.getCurrentNavigation()?.extras.state?.depositWarning as boolean;
  }

  ngOnInit(): void {
    this.callFleetDeposit();
    this.breadCrumb = [
      {
        label: 'MENU.Validation',
        url: '/validation'
      },
      {
        label: this.depositWarning ? 'MENU.Deposit-valid' : 'MENU.Vehicle-valid',
        url: ''
      }
    ];
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public callFleetDeposit(): void {
    this.complete = false;
    this.subscription.push(this.fleetService.getFleetDeposit(this.depositWarning).subscribe({
      next: fleetM => {
        this.dataSource.data = fleetM;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.fleetListConnect = this.dataSource.connect();
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
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

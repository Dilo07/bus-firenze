import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FileViewer, ViewFileComponent } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { DriverService } from 'src/app/services/driver.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { STATUS_VEHICLE } from '../../domain/bus-firenze-constants';
import { DepositType, DocumentVehicle, FleetManager, Vehicle } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { AssociationDriversVehiclesComponent } from '../drivers/modal-association-drivers-vehicles/association-drivers-vehicles.component';
import { ModalFormVehicleComponent } from './modal-form-vehicle/modal-form-vehicle.component';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: [`
  table {
    width: 100%;
  }
  .obuDisactive{
    opacity: 0.8;
  }
  @media(min-width: 1180px) {
    .mat-column-id { max-width: 20%}
    .mat-column-plate { max-width: 10%;}
    .mat-column-nat { max-width: 5%}
    .mat-column-certificateId { max-width: 10%}
    .mat-column-euroClass { max-width: 10%;}
    .mat-column-obuId { max-width: 15%;}
    .mat-column-consent { max-width: 10%;}
    .mat-column-actions { max-width: 20%; display: table-column;}
  }

  ::ng-deep .menu-color {
    background: #E4F1F5;
  }
  .icon-assignment-grey:before {
    color: grey;
    font-weight: bold;
  }
  .icon-warning:before {
    color: red;
  }
  `],
})
export class VehiclesComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(ViewFileComponent) viewFile: ViewFileComponent;

  public fleetManager: FleetManager;
  public vehicleList = new MatTableDataSource<Vehicle>([]);
  public displayedColumns = ['id', 'plate', 'nat', 'certificateId', 'euroClass', 'obuId', 'consent', 'actions'];
  public search: FormGroup;
  public complete = true;
  public statusVehicle = STATUS_VEHICLE;
  public src: FileViewer = { type: '', url: '', fileName: '' };

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private snackBar: SnackBar,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) {
    // se è utente movyon op movyon fleetManager sarà valorizzato in caso di ruolo fleetmanger no
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      onlyActive: [true]
    });
    this.getVehiclesByManagerId(); // sia per fleet che op_movyon
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getVehiclesByManagerId(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch').value;
    const onlyActive = this.search.get('onlyActive').value;
    // in caso di op_movyon movyon passa l'id altrimento no
    this.vehicleService.getVehiclesById(onlyActive, this.fleetManager?.id, keyword).subscribe(
      data => {
        this.vehicleList.data = data;
        this.vehicleList.sort = this.sort;
        this.vehicleList.paginator = this.paginator;
      },
      () => this.complete = true,
      () => this.complete = true);
  }

  public addVehicle(): void {
    const dialogRef = this.dialog.open(ModalFormVehicleComponent, {
      width: '90%',
      height: '90%',
      autoFocus: false,
      data: { vehicle: null, fleetManagerId: this.fleetManager?.id }
    });
    dialogRef.afterClosed().subscribe((add) => {
      if (add) {
        this.getVehiclesByManagerId();
        this.resetSearchField();
      }
    });
  }

  public editVehicle(vEhicle: Vehicle): void {
    const dialogRef = this.dialog.open(ModalFormVehicleComponent, {
      width: '90%',
      height: '90%',
      data: { vehicle: vEhicle, fleetManagerId: this.fleetManager?.id }
    });
    dialogRef.afterClosed().subscribe((edit) => {
      if (edit) {
        this.getVehiclesByManagerId();
        this.resetSearchField();
      }
    });
  }

  public deleteVehicle(vehicleId: number, documents: DocumentVehicle[]): void {
    let hasDepositValid = false;
    const deposit: DepositType = 'deposit';
    documents.map(document => {
      if (document.type === deposit && document.valid) { hasDepositValid = true; }
    });
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '50%',
      data: { text: 'VEHICLE.DELETE_CONFIRM', uploadDoc: hasDepositValid ? 'VEHICLE.DEPOSIT_REQ' : null },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((respConfirm) => {
      if (respConfirm) {
        const file = respConfirm.file ? respConfirm.file : null;
        this.vehicleService.deleteVehicle(vehicleId, file, this.fleetManager?.id).subscribe(
          () => this.snackBar.showMessage('VEHICLE.DELETE_SUCCESS', 'INFO'),
          () => null,
          () => {
            this.getVehiclesByManagerId();
            this.resetSearchField();
          });
      }
    });
  }

  public updateStatus(vehicleId: number): void {
    this.vehicleService.updateStatusVehicle(vehicleId).subscribe(
      () => null,
      () => null,
      () => this.getVehiclesByManagerId()
    );
  }

  public associationDriver(vehicleId: number): void {
    this.driverService.getDriversByVehicle(vehicleId, this.fleetManager?.id).subscribe(
      drivers => {
        this.dialog.open(AssociationDriversVehiclesComponent, {
          width: '80%',
          height: '80%',
          data: { driverVehicle: drivers, idVehicle: vehicleId, fleetManagerId: this.fleetManager?.id },
          autoFocus: false
        });
      });
  }

  public downloadManualPdf(device: number): void {
    const fileSaver = require('file-saver');
    this.subscription.push(this.vehicleService.getManual(device, 'operating')
      .subscribe((data: HttpResponse<Blob>) => {
        const contentDispositionHeader = data.headers.get('Content-Disposition');
        const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
        fileSaver.saveAs(data.body, filename);
      })
    );
  }

  public viewCertificate(vehicleId: number, certificateId: number): void {
    this.subscription.push(this.vehicleService.getCertificateFile(vehicleId, certificateId)
      .subscribe((data: HttpResponse<Blob>) => {
        if (data.body.type === 'application/pdf') { // se è un pdf
          const objectUrl = window.URL.createObjectURL(data.body);
          const contentDispositionHeader = data.headers.get('Content-Disposition');
          const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
          this.src = { url: objectUrl, type: data.body.type, fileName: filename };
        } else { // altrimenti se è un'immagine
          const reader = new FileReader();
          reader.readAsDataURL(data.body);
          reader.onload = () => {
            this.src = { url: reader.result, type: data.body.type, fileName: '' };
          };
        }
      }));
  }

  public uploadCertificate(vehicleId: number, event: any): void {
    this.complete = false;
    const file = event.target.files[0];
    const type = event.target.files[0].type;
    const size = event.target.files[0].size;
    if (type !== 'application/pdf' && type !== 'image/jpeg' && type !== 'image/png') { // formato errato
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR');
      this.complete = true;
    } else if (size > 2097152) { // dimensione massima
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
      this.complete = true;
    } else {
      this.subscription.push(this.vehicleService.uploadCertificate(vehicleId, file, this.fleetManager?.id).subscribe(
        () => this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO'),
        () => this.complete = true,
        () => { this.getVehiclesByManagerId(); this.complete = true; }
      ));
    }
  }

  private resetSearchField(): void {
    this.search.patchValue({
      ctrlSearch: ''
    });
  }

}

import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DriverService } from 'src/app/services/driver.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { DEPOSIT_TYPE, STATUS_VEHICLE } from '../../domain/bus-firenze-constants';
import { DocumentVehicle, FleetManager, Vehicle } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { AssociationDriversVehiclesComponent } from '../drivers/modal-association-drivers-vehicles/association-drivers-vehicles.component';
import { ModalFormVehicleComponent } from './modal-form-vehicle/modal-form-vehicle.component';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: [`
  table {
    width: 100%;
    background-color: beige;
  }
  .obuDisactive{
    opacity: 0.8;
  }
  @media(min-width: 1180px) {
    .mat-column-id { max-width: 10%}
    .mat-column-plate { max-width: 10%;}
    .mat-column-nat { max-width: 5%}
    .mat-column-certificateId { max-width: 10%}
    .mat-column-depositDocument { max-width: 10%}
    .mat-column-euroClass { max-width: 10%;}
    .mat-column-obuId { max-width: 15%;}
    .mat-column-consent { max-width: 10%;}
    .mat-column-actions { max-width: 20%; display: table-column;}
  }
  `],
})
export class VehiclesComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public fleetManager: FleetManager;
  public vehicleList = new MatTableDataSource<Vehicle>([]);
  public displayedColumns = ['id', 'plate', 'nat', 'certificateId', 'depositDocument', 'euroClass', 'obuId', 'consent', 'actions'];
  public Search: FormGroup;
  public complete = true;
  public statusVehicle = STATUS_VEHICLE;
  public src: { type: string, url: string | ArrayBuffer } = { type: '', url: '' };

  private depositType = DEPOSIT_TYPE;
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
    this.Search = this.formBuilder.group({
      CtrlSearch: [''],
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
    const keyword = this.Search.get('CtrlSearch').value;
    const onlyActive = this.Search.get('onlyActive').value;
    // in caso di op_movyon movyon passa l'id altrimento no
    this.vehicleService.getVehiclesById(onlyActive, this.fleetManager?.id, keyword).subscribe(data => {
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

  public deleteVehicle(vehicleId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: 'VEHICLE.DELETE_CONFIRM' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.vehicleService.deleteVehicle(vehicleId, this.fleetManager?.id).subscribe(
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
    const FileSaver = require('file-saver');
    this.subscription.push(this.vehicleService.getManual(device, 'operating')
      .subscribe((data: HttpResponse<Blob>) => {
        const contentDispositionHeader = data.headers.get('Content-Disposition');
        const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
        FileSaver.saveAs(data.body, filename);
      })
    );
  }

  public viewCertificate(vehicleId: number, certificateId: number): void {
    this.subscription.push(this.vehicleService.getCertificateFile(vehicleId, certificateId)
      .subscribe((data) => {
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

  public uploadCertificate(vehicleId: number, event: any): void {
    this.complete = false;
    const file = event.target.files[0];
    this.subscription.push(this.vehicleService.uploadCertificate(vehicleId, file, this.fleetManager?.id).subscribe(
      () => this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO'),
      () => this.complete = true,
      () => { this.getVehiclesByManagerId(); this.complete = true; }
    ));
  }

  public viewDeposit(vehicleId: number, documents: DocumentVehicle[]): void {
    let depositId: number;
    documents.map(document => {
      if (document.type === 'deposit') { depositId = document.fileId; }
    });
    this.subscription.push(this.vehicleService.getDeposit(vehicleId, this.depositType.DEPOSIT, depositId)
      .subscribe((data) => {
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

  public uploadDeposit(vehicleId: number, event: any, isDeposit: boolean): void {
    this.complete = false;
    const file = event.target.files[0];
    const deposit = isDeposit ? this.depositType.DEPOSIT : this.depositType.REQUEST;
    this.subscription.push(this.vehicleService.uploadDeposit(vehicleId, deposit, file, this.fleetManager?.id).subscribe(
      () => this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO'),
      () => this.complete = true,
      () => { this.getVehiclesByManagerId(); this.complete = true; }
    ));
  }

  private resetSearchField(): void {
    this.Search.patchValue({
      CtrlSearch: ''
    });
  }

}

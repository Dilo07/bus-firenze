import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Breadcrumb, SnackBar, ViewFileModalComponent } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { DepositType, DocumentObu, DocumentVehicle, FleetManager, Vehicle } from 'src/app/components/domain/bus-firenze-domain';
import { VehicleService } from 'src/app/services/vehicle.service';
import { MatDialog } from '@angular/material/dialog';
import { InstallerService } from 'src/app/services/installer.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DepositDocumentsComponent implements OnInit {
  public vehicle: Vehicle;
  public breadCrumb: Breadcrumb[] = [];
  public fleetManager: FleetManager;
  public withDocument: boolean;
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private installerService: InstallerService,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    @Inject('ibanData') public iban: string,) {
    this.vehicle = this.router.getCurrentNavigation()?.extras.state?.vehicle as Vehicle;
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.withDocument = this.router.getCurrentNavigation()?.extras.state?.withDoc as boolean;
  }

  ngOnInit(): void {
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
          url: '../../selection',
          state: this.fleetManager
        },
        {
          label: 'MENU.Deposit',
          url: '../',
          state: this.fleetManager
        },
        {
          label: 'VEHICLE.DOCUMENT',
          url: ''
        });
    } else { // ruolo fleet manager
      this.breadCrumb.push(
        {
          label: 'MENU.Deposit',
          url: '../'
        },
        {
          label: 'VEHICLE.DOCUMENT',
          url: ''
        });
    }
  }

  public viewDeposit(vehicleId: number, documents: DocumentVehicle[], depositType: DepositType[]): void {
    this.complete = false;
    const documentFind: DocumentVehicle = documents.find((document) => depositType.includes(document.type));
    this.subscription.push(this.vehicleService.getDeposit(vehicleId, documentFind.type, documentFind.fileId)
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

  public viewDocObu(vehicleId: number, documentsObu: DocumentObu): void {
    this.complete = false;
    // prende il primo documento
    this.subscription.push(this.installerService.getDocObu(vehicleId, documentsObu.obuId, documentsObu.type, documentsObu.fileId)
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
        complete: () => { this.getSingleVehicle(); this.complete = true; }
      }));
    }
  }

  private getSingleVehicle(): void {
    this.subscription.push(this.vehicleService.getVehicleById(this.fleetManager.id, this.vehicle.id).subscribe(
      (vehicle) => this.vehicle = vehicle
    ));
  }
}

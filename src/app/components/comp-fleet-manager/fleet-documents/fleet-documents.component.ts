import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FileViewer, ViewFileModalComponent } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetDocument } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-modal-fleet-documents',
  templateUrl: './fleet-documents.component.html',
  styles: [
  ]
})
export class FleetDocumentsComponent implements OnDestroy {
  public src: FileViewer = { type: '', url: '', fileName: '' };
  public complete = true;
  public fmId: number;
  public documents: FleetDocument[];
  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fleetManagerService: FleetManagerService
  ) {
    this.fmId = this.router.getCurrentNavigation()?.extras.state?.fmId as number;
    this.documents = this.router.getCurrentNavigation()?.extras.state?.documents as FleetDocument[];
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public viewDocument(fileId: number): void {
    this.complete = false;
    this.subscription.push(this.fleetManagerService.getFleetDocument(this.fmId, fileId).subscribe(
      (data: HttpResponse<Blob>) => {
        if (data.body.type === 'application/pdf') { // se è un pdf
          const URL = window.URL.createObjectURL(data.body);
          const contentDispositionHeader = data.headers.get('Content-Disposition');
          const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
          this.dialog.open(ViewFileModalComponent, {
            width: '50%',
            height: '90%',
            autoFocus: false,
            data: { url: URL, type: data.body.type, fileName: filename }
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
      () => this.complete = true,
      () => this.complete = true
    ));
  }

  public validDocument(fileId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: 'FLEET-MANAGER.DOCUMENT_CONFIRM' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.complete = false;
          this.subscription.push(this.fleetManagerService.validDocumentFleet(this.fmId, fileId).subscribe(
            () => null,
            () => this.complete = true,
            () => (this.refreshFleetDocuments(), this.complete = true)
          ));
        }
      }
    );
  }

  private refreshFleetDocuments(): void {
    this.subscription.push(this.fleetManagerService.getFleetManagerById(this.fmId).subscribe(
      fleet => this.documents = fleet.documents
    ));
  }
}

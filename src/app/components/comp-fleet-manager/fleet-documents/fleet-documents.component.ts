import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  public src: { type: string; url: string | ArrayBuffer } = { type: '', url: '' };
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
          this.src = { url: URL, type: data.body.type };
        } else { // altrimenti se è un'immagine
          const reader = new FileReader();
          reader.readAsDataURL(data.body);
          reader.onload = () => {
            this.src = { url: reader.result, type: data.body.type };
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

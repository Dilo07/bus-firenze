import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Breadcrumb, FileViewer, ViewFileModalComponent } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetManager } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-modal-fleet-documents',
  templateUrl: './fleet-documents.component.html',
  styles: [`
  .status {
    border-radius: 28px;
    color: white;
    padding: 8px 12px;
  }
  `
  ]
})
export class FleetDocumentsComponent implements OnDestroy {
  public src: FileViewer = { type: '', url: '', fileName: '' };
  public complete = true;
  public fleetManager: FleetManager;
  public breadCrumb: Breadcrumb[];
  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fleetManagerService: FleetManagerService
  ) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.breadCrumb = [
      {
        label: 'Fleet manager',
        url: '/manage'
      },
      {
        label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
        url: '../selection-card',
        state: { fleetManager: this.fleetManager }
      },
      {
        label: 'MENU.Documents',
        url: ''
      }
    ];
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public viewDocument(fileId: number): void {
    this.complete = false;
    this.subscription.push(this.fleetManagerService.getFleetDocument(this.fleetManager.id, fileId).subscribe(
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
          this.subscription.push(this.fleetManagerService.validDocumentFleet(this.fleetManager.id, fileId).subscribe({
            error: () => this.complete = true,
            complete: () => (this.refreshFleetDocuments(), this.complete = true)
          }));
        }
      }
    );
  }

  private refreshFleetDocuments(): void {
    this.subscription.push(this.fleetManagerService.getFleetManagerById(this.fleetManager.id).subscribe(
      fleet => this.fleetManager = fleet
    ));
  }
}

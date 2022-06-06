import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetDocument } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-modal-fleet-documents',
  templateUrl: './modal-fleet-documents.component.html',
  styles: [
  ]
})
export class ModalFleetDocumentsComponent implements OnDestroy {
  public src: { type: string; url: string | ArrayBuffer } = { type: '', url: '' };
  public complete = true;
  private subscription: Subscription[] = [];

  constructor(
    private fleetManagerService: FleetManagerService,
    @Inject(MAT_DIALOG_DATA) public data: { fmId: number; documents: FleetDocument[] }
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public viewDocument(fileId: number): void {
    this.complete = false;
    this.subscription.push(this.fleetManagerService.getFleetDocument(this.data.fmId, fileId).subscribe(
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
    this.complete = false;
    this.subscription.push(this.fleetManagerService.validDocumentFleet(this.data.fmId, fileId).subscribe(
      () => null,
      () => this.complete = true,
      () => this.complete = true
    ));
  }
}

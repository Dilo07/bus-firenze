import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-expansion-info-vehicle',
  templateUrl: './expansion-info-vehicle.component.html',
  styles: [`
  .link {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
  .mat-expansion-panel {
    width: 97%;
    background-color: #E4F1F5;
  }
  `
  ]
})
export class ExpansionInfoVehicleComponent implements OnDestroy {
  private subscription: Subscription[] = [];

  constructor(private documentService: DocumentService) { }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public downloadDocument(): void {
    const fileSaver = require('file-saver');
    const path = 'IBUS_Firenze_Condizioni_Economiche.pdf';
    this.subscription.push(this.documentService.getDocument(path).subscribe(
      (data: HttpResponse<Blob>) => {
        const contentDispositionHeader = data.headers.get('Content-Disposition');
        const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
        fileSaver.saveAs(data.body, filename);
      }));
  }

}

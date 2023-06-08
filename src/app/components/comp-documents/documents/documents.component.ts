import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { Modules } from '../../domain/bus-firenze-domain';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnDestroy {
  public documentSelect: string[] = [];
  public complete = true;
  private subscription: Subscription[] = [];

  constructor(
    private documentService: DocumentService,
    @Inject('modulesData') public modules: Modules[]
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  public download(path?: string): void {
    if (path) { // single download
      this.callApiDocument(path);
    } else { // multi download
      this.documentSelect.forEach(path => {
        this.callApiDocument(path);
      });
    }
  }

  public select(event: MatCheckboxChange, path: string): void {
    if (event.checked) {
      this.documentSelect.push(path);
    } else {
      const index = this.documentSelect.indexOf(path);
      this.documentSelect.splice(index, 1);
    }
  }

  private callApiDocument(path: string): void {
    const fileSaver = require('file-saver');
    this.complete = false;
    this.subscription.push(this.documentService.getDocument(path).subscribe({
      next: (data: HttpResponse<Blob>) => {
        const contentDispositionHeader = data.headers.get('Content-Disposition');
        const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
        fileSaver.saveAs(data.body, filename);
      },
      error: () => this.complete = true,
      complete: () => (this.unsubscribe, this.complete = true)
    }));
  }

  private unsubscribe(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}

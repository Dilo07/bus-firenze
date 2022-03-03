import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';
import { Modules } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styles: [
  ]
})
export class DocumentsComponent implements OnInit {

  constructor(
    private documentService: DocumentService,
    @Inject('modulesData') public modules: Modules[]
  ) { }

  ngOnInit(): void {
  }

  public download(path: string): void {
    const FileSaver = require('file-saver');
    this.documentService.getDocument(path).subscribe(
      (data: HttpResponse<Blob>) => {
        const contentDispositionHeader = data.headers.get('Content-Disposition');
        const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
        FileSaver.saveAs(data.body, filename);
      });
  }
}

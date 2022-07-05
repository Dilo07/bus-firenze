import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-expansion-info',
  templateUrl: './expansion-info.component.html',
  styles: [`
  .link {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
  `
  ]
})
export class ExpansionInfoComponent {

  private subscription: Subscription[] = [];
  constructor(private registerService: RegisterService) { }

  public downloadTemplate(): void {
    const fileSaver = require('file-saver');
    this.subscription.push(this.registerService.getTemplateDocument().subscribe(
      (data: HttpResponse<Blob>) => {
        const contentDispositionHeader = data.headers.get('Content-Disposition');
        const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
        fileSaver.saveAs(data.body, filename);
      }));
  }
}

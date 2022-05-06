import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents/documents.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@npt/npt-template';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    DocumentsRoutingModule
  ]
})
export class DocumentsModule { }

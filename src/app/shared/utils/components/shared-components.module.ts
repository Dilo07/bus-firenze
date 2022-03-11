import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewFileComponent } from './view-file/view-file.component';
import { MaterialModule } from '@npt/npt-template';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [ViewFileComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    PdfViewerModule
  ],
  exports: [ViewFileComponent]
})
export class SharedComponentsModule { }

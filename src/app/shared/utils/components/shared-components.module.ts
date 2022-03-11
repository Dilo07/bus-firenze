import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewFileComponent } from './view-file/view-file.component';
import { MaterialModule } from '@npt/npt-template';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TableFleetComponent } from './table-fleet/table-fleet.component';
import { PipesModule } from '../pipes/pipes-module.module';

@NgModule({
  declarations: [
    ViewFileComponent,
    TableFleetComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    PdfViewerModule,
    PipesModule
  ],
  exports: [
    ViewFileComponent,
    TableFleetComponent
  ]
})
export class SharedComponentsModule { }

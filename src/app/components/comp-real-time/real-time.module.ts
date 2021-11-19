import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealTimeRoutingModule } from './real-time.routing';
import { RealTimeComponent } from './real-time.component';
import { NptMapModule } from '@npt/npt-map';
import { MaterialModule } from '@npt/npt-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { TableRealTimeComponent } from './table-real-time/table-real-time.component';


@NgModule({
  declarations: [
    RealTimeComponent,
    TableRealTimeComponent
  ],
  imports: [
    CommonModule,
    NptMapModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    RealTimeRoutingModule
  ]
})
export class RealTimeModule { }

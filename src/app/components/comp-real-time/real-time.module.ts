import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealTimeRoutingModule } from './real-time.routing';
import { RealTimeComponent } from './real-time.component';
import { NptMapModule } from '@npt/npt-map';
import { MaterialModule } from '@npt/npt-template';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    RealTimeComponent
  ],
  imports: [
    CommonModule,
    NptMapModule,
    MaterialModule,
    FlexLayoutModule,
    RealTimeRoutingModule
  ]
})
export class RealTimeModule { }

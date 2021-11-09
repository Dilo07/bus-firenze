import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealTimeRoutingModule } from './real-time.routing';
import { RealTimeComponent } from './real-time.component';


@NgModule({
  declarations: [
    RealTimeComponent
  ],
  imports: [
    CommonModule,
    RealTimeRoutingModule
  ]
})
export class RealTimeModule { }

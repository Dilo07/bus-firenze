import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NptMapModule } from '@npt/npt-map';
import { MaterialModule } from '@npt/npt-template';
import { NgDynamicBreadcrumbModule } from 'ng-dynamic-breadcrumb';
import { ModalVehicleDetailsComponent } from './modal-vehicle-details/modal-vehicle-details.component';
import { RealTimeComponent } from './real-time.component';
import { RealTimeRoutingModule } from './real-time.routing';
import { TableRealTimeComponent } from './table-real-time/table-real-time.component';


@NgModule({
  declarations: [
    RealTimeComponent,
    TableRealTimeComponent,
    ModalVehicleDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NptMapModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    RealTimeRoutingModule,
    NgDynamicBreadcrumbModule
  ]
})
export class RealTimeModule { }

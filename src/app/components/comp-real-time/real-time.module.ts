import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NptMapModule } from '@npt/npt-map';
import { BreadcrumbNptModule, MaterialModule, ScrollbarModule } from '@npt/npt-template';
import { ModalVehicleDetailsComponent } from './modal-vehicle-details/modal-vehicle-details.component';
import { RealTimeComponent } from './real-time.component';
import { RealTimeRoutingModule } from './real-time.routing';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes.module';
import { StatusVehiclePipe } from 'src/app/shared/utils/pipes/status-vehicle.pipe';


@NgModule({
  declarations: [
    RealTimeComponent,
    ModalVehicleDetailsComponent
  ],
  providers: [
    StatusVehiclePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NptMapModule,
    MaterialModule,
    ScrollbarModule,
    FlexLayoutModule,
    TranslateModule,
    RealTimeRoutingModule,
    BreadcrumbNptModule,
    PipesModule
  ]
})
export class RealTimeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetManagerRoutingModule } from './fleet-manager.routing';
import { FleetManagerComponent } from './comp-fleet-manager.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@npt/npt-template';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    FleetManagerComponent,
    VehiclesComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FleetManagerRoutingModule
  ]
})
export class FleetManagerModule { }

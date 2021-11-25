import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FleetManagerRoutingModule } from './fleet-manager.routing';
import { FleetManagerComponent } from './comp-fleet-manager.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@npt/npt-template';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { HttpClientModule } from '@angular/common/http';
import { FormFleetManagerComponent } from './form-fleet-manager/form-fleet-manager.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalFormVehicleComponent } from './vehicles/modal-form-vehicle/modal-form-vehicle.component';
import { RegisterComponent } from './register-page/register.component';
import { ModalOTPComponent } from './register-page/modal-otp/modal-otp.component';
import { PanelStatisticComponent } from './vehicles/panel-statistic/panel-statistic.component';
import { TripStatisticComponent } from './vehicles/trip-statistic/trip-statistic.component';
import { StatisticComponent } from './vehicles/page-statistic/statistic.component';
import { NptMapModule } from '@npt/npt-map';
import { TableStatisticComponent } from './vehicles/table-statistic/table-statistic.component';
import { AnagraphicFleetManagerComponent } from './anagraphic-fleet-manager/anagraphic-fleet-manager.component';
import { DriversComponent } from './drivers/drivers.component';


@NgModule({
  declarations: [
    FleetManagerComponent,
    VehiclesComponent,
    FormFleetManagerComponent,
    ModalFormVehicleComponent,
    RegisterComponent,
    ModalOTPComponent,
    PanelStatisticComponent,
    TripStatisticComponent,
    StatisticComponent,
    TableStatisticComponent,
    AnagraphicFleetManagerComponent,
    DriversComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NptMapModule,
    FleetManagerRoutingModule
  ],
  exports: [FormFleetManagerComponent]
})
export class FleetManagerModule { }

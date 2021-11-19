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
import { StatisticComponent } from './vehicles/statistic/statistic.component';


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
    StatisticComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FleetManagerRoutingModule
  ],
  exports: [FormFleetManagerComponent]
})
export class FleetManagerModule { }

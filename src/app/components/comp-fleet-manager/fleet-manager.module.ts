import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NptMapModule } from '@npt/npt-map';
import { DebounceClickModule, MaterialModule, ViewFileComponentsModule } from '@npt/npt-template';
import { MatSelectFilterModule } from 'mat-select-filter';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes.module';
import { Ng2telinputDirective } from '../directive/ng2telinput.directive';
import { AnagraphicFleetManagerComponent } from './anagraphic-fleet-manager/anagraphic-fleet-manager.component';
import { FleetManagerComponent } from './comp-fleet-manager.component';
import { AnagraphicDriverComponent } from './drivers/anagraphic-driver/anagraphic-driver.component';
import { AssociationVehiclesComponent } from './drivers/association-vehicles/association-vehicles.component';
import { DriversComponent } from './drivers/drivers.component';
import { AssociationDriversVehiclesComponent } from './drivers/modal-association-drivers-vehicles/association-drivers-vehicles.component';
import { FormDriverComponent } from './drivers/modal-form-driver/form-driver.component';
import { FleetDocumentsComponent } from './fleet-documents/fleet-documents.component';
import { FleetManagerRoutingModule } from './fleet-manager.routing';
import { ExpansionInfoComponent } from './form-fleet-manager/expansion-info/expansion-info.component';
import { FormFleetManagerComponent } from './form-fleet-manager/form-fleet-manager.component';
import { ModalOTPComponent } from './register-page/modal-otp/modal-otp.component';
import { RegisterComponent } from './register-page/register.component';
import { ExpansionInfoVehicleComponent } from './vehicles/modal-form-vehicle/expansion-info-vehicle/expansion-info-vehicle.component';
import { ModalFormVehicleComponent } from './vehicles/modal-form-vehicle/modal-form-vehicle.component';
import { StatisticComponent } from './vehicles/page-statistic/statistic.component';
import { PanelStatisticComponent } from './vehicles/panel-statistic/panel-statistic.component';
import { TableStatisticComponent } from './vehicles/table-statistic/table-statistic.component';
import { TripStatisticComponent } from './vehicles/trip-statistic/trip-statistic.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { FormFieldPersonComponent } from './form-fleet-manager/field-person/form-field-person.component';


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
    DriversComponent,
    FormDriverComponent,
    AssociationDriversVehiclesComponent,
    AnagraphicDriverComponent,
    AssociationVehiclesComponent,
    Ng2telinputDirective,
    ExpansionInfoComponent,
    ExpansionInfoVehicleComponent,
    FleetDocumentsComponent,
    FormFieldPersonComponent
  ],
  imports: [
    CommonModule,
    ViewFileComponentsModule,
    HttpClientModule,
    MaterialModule,
    DebounceClickModule,
    MatSelectFilterModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NptMapModule,
    FleetManagerRoutingModule,
    PipesModule
  ],
  exports: [FleetManagerComponent]
})
export class FleetManagerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFleetmanagerComponent } from './fleetmanager/list-fleetmanager.component';
import { ValidVehiclesRoutingModule } from './valid-vehicles.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@npt/npt-template';
import { TranslateModule } from '@ngx-translate/core';
import { VerifyVehiclesComponent } from './verify-vehicles/verify-vehicles.component';
import { FleetManagerModule } from '../comp-fleet-manager/fleet-manager.module';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes-module.module';


@NgModule({
  declarations: [
    ListFleetmanagerComponent,
    VerifyVehiclesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    ValidVehiclesRoutingModule,
    FleetManagerModule,
    PipesModule
  ]
})
export class ValidVehiclesModule { }

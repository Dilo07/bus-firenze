import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule, ViewFileComponentsModule } from '@npt/npt-template';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes.module';
import { ListFleetmanagerComponent } from './list-fleetManager/list-fleetmanager.component';
import { PageValidComponent } from './page-valid.component';
import { ValidVehiclesRoutingModule } from './valid.routing';
import { VerifyVehiclesComponent } from './list-verify-vehicles/verify-vehicles.component';
import { FleetManagerModule } from '../comp-fleet-manager/fleet-manager.module';
import { ListWarningVehiclesComponent } from './list-warning-vehicles/list-warning-vehicles.component';


@NgModule({
  declarations: [
    ListFleetmanagerComponent,
    VerifyVehiclesComponent,
    PageValidComponent,
    ListWarningVehiclesComponent
  ],
  imports: [
    CommonModule,
    ViewFileComponentsModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    ValidVehiclesRoutingModule,
    PipesModule,
    FleetManagerModule
  ]
})
export class ValidVehiclesModule { }

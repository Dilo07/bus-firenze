import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule, SharedLibComponentsModule } from '@npt/npt-template';
import { SharedComponentsModule } from 'src/app/shared/utils/components/shared-components.module';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes-module.module';
import { ListFleetmanagerComponent } from './verify-vehicles/list-fleetmanager.component';
import { PageValidComponent } from './page-valid.component';
import { ValidVehiclesRoutingModule } from './valid.routing';
import { VerifyVehiclesComponent } from './verify-vehicles/list-verify-vehicles/verify-vehicles.component';
import { FleetManagerModule } from '../comp-fleet-manager/fleet-manager.module';


@NgModule({
  declarations: [
    ListFleetmanagerComponent,
    VerifyVehiclesComponent,
    PageValidComponent
  ],
  imports: [
    CommonModule,
    SharedLibComponentsModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    ValidVehiclesRoutingModule,
    PipesModule,
    FleetManagerModule
  ]
})
export class ValidVehiclesModule { }

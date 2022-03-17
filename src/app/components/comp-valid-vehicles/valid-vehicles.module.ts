import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@npt/npt-template';
import { SharedComponentsModule } from 'src/app/shared/utils/components/shared-components.module';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes-module.module';
import { ListFleetmanagerComponent } from './fleetmanager/list-fleetmanager.component';
import { ValidVehiclesRoutingModule } from './valid-vehicles.routing';
import { VerifyVehiclesComponent } from './verify-vehicles/verify-vehicles.component';


@NgModule({
  declarations: [
    ListFleetmanagerComponent,
    VerifyVehiclesComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    ValidVehiclesRoutingModule,
    PipesModule
  ]
})
export class ValidVehiclesModule { }

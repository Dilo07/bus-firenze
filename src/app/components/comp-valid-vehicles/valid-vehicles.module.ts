import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFleetmanagerComponent } from './fleetmanager/list-fleetmanager.component';
import { ValidVehiclesRoutingModule } from './valid-vehicles.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@npt/npt-template';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ListFleetmanagerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    ValidVehiclesRoutingModule
  ]
})
export class ValidVehiclesModule { }

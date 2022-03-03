import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFleetmanagerComponent } from './fleetmanager/list-fleetmanager.component';
import { ValidVehiclesRoutingModule } from './valid-vehicles.routing';


@NgModule({
  declarations: [
    ListFleetmanagerComponent
  ],
  imports: [
    CommonModule,
    ValidVehiclesRoutingModule
  ]
})
export class ValidVehiclesModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FleetManagerComponent } from './comp-fleet-manager.component';
import { VehiclesComponent } from './vehicles/vehicles.component';

const routes: Routes = [
  { path: '', component: FleetManagerComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'vehicles-fleet-manager/', component: VehiclesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetManagerRoutingModule { }

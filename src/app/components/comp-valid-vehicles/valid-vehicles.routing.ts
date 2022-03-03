import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFleetmanagerComponent } from './fleetmanager/list-fleetmanager.component';

const routes: Routes = [
  { path: '', component: ListFleetmanagerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidVehiclesRoutingModule { }

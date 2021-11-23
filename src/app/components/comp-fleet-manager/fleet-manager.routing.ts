import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { AnagraphicFleetManagerComponent } from './anagraphic-fleet-manager/anagraphic-fleet-manager.component';
import { FleetManagerComponent } from './comp-fleet-manager.component';
import { FormFleetManagerComponent } from './form-fleet-manager/form-fleet-manager.component';
import { StatisticComponent } from './vehicles/page-statistic/statistic.component';
import { VehiclesComponent } from './vehicles/vehicles.component';

const routes: Routes = [
  { path: '', component: FleetManagerComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
  {
    path: 'form-Fleet',
    component: FormFleetManagerComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  },
  {
    path: 'anagraphic',
    component: AnagraphicFleetManagerComponent, canActivate: [AuthGuard], data: { roles: [ROLES.FLEETMNG] }
  },
  {
    path: 'vehicles',
    component: VehiclesComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] }
  },
  {
    path: 'vehicles/statistic',
    component: StatisticComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetManagerRoutingModule { }

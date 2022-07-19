import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { AnagraphicFleetManagerComponent } from '../anagraphic-fleet-manager/anagraphic-fleet-manager.component';
import { DriversComponent } from '../drivers/drivers.component';
import { FormDriverComponent } from '../drivers/modal-form-driver/form-driver.component';
import { StatisticComponent } from '../vehicles/page-statistic/statistic.component';
import { VehiclesComponent } from '../vehicles/vehicles.component';

const routes: Routes = [
  {
    path: 'anagraphic-fleet',
    component: AnagraphicFleetManagerComponent, canActivate: [AuthGuard], data: { roles: [ROLES.FLEETMNG] }
  },
  {
    path: 'vehicles',
    component: VehiclesComponent, canActivate: [AuthGuard], data: { roles: [ROLES.FLEETMNG] }
  },
  {
    path: 'vehicles/statistic', // per raggiungere le statistiche da fm
    component: StatisticComponent, canActivate: [AuthGuard], data: { roles: [ROLES.FLEETMNG] }
  },
  {
    path: 'drivers',
    component: DriversComponent, canActivate: [AuthGuard], data: { roles: [ROLES.FLEETMNG] }
  },
  {
    path: 'form-Driver',
    component: FormDriverComponent, canActivate: [AuthGuard], data: { roles: [ROLES.FLEETMNG] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedirectFleetRoutingModule { }

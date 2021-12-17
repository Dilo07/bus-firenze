import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { DriveGuard } from 'src/app/core/guards/driverGuard';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { AnagraphicFleetManagerComponent } from './anagraphic-fleet-manager/anagraphic-fleet-manager.component';
import { FleetManagerComponent } from './comp-fleet-manager.component';
import { AnagraphicDriverComponent } from './drivers/anagraphic-driver/anagraphic-driver.component';
import { AssociationVehiclesComponent } from './drivers/association-vehicles/association-vehicles.component';
import { DriversComponent } from './drivers/drivers.component';
import { FormDriverComponent } from './drivers/modal-form-driver/form-driver.component';
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
    path: 'form-Driver',
    component: FormDriverComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.FLEETMNG, ROLES.DRIVER] }
  },
  {
    path: 'anagraphic-fleet',
    component: AnagraphicFleetManagerComponent, canActivate: [AuthGuard], data: { roles: [ROLES.FLEETMNG] }
  },
  {
    path: 'drivers',
    component: DriversComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.FLEETMNG] }
  },
  {
    path: 'vehicles',
    component: VehiclesComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] }
  },
  {
    path: 'vehicles/statistic',
    component: StatisticComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] }
  },
  {
    path: 'anagraphic-driver',
    component: AnagraphicDriverComponent, canActivate: [AuthGuard, DriveGuard], data: { roles: [ROLES.DRIVER] }
  },
  {
    path: 'association-driver',
    component: AssociationVehiclesComponent, canActivate: [AuthGuard, DriveGuard], data: { roles: [ROLES.DRIVER] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetManagerRoutingModule { }

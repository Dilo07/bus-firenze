import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManagerComponent } from './comp-fleet-manager.component';
import { DriversComponent } from './drivers/drivers.component';
import { FormDriverComponent } from './drivers/details-form-driver/form-driver.component';
import { FleetDocumentsComponent } from './fleet-documents/fleet-documents.component';
import { FormFleetManagerComponent } from './form-fleet-manager/form-fleet-manager.component';
import { StatisticComponent } from './vehicles/page-statistic/statistic.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { SelectionCardsPageComponent } from './selection-cards-page/selection-cards-page.component';

// rotte admin
const routes: Routes = [
  {
    path: '', component: FleetManagerComponent, canActivate: [AuthGuard],
    data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  },
  {
    path: 'selection-card',
    component: SelectionCardsPageComponent, canActivate: [AuthGuard],
    data: {
      roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
    }
  },
  {
    path: 'real-time', loadChildren: () => import('../comp-real-time/real-time.module').then(m => m.RealTimeModule)
  },
  {
    path: 'form-Fleet',
    component: FormFleetManagerComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  },
  {
    path: 'fleet-documents',
    component: FleetDocumentsComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  },
  {
    path: 'form-Driver',
    component: FormDriverComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  },
  {
    path: 'drivers',
    component: DriversComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  },
  {
    path: 'vehicles',
    component: VehiclesComponent, canActivate: [AuthGuard],
    data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  },
  {
    path: 'vehicles/statistic', // per raggiungere le statistiche da fm
    component: StatisticComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetManagerRoutingModule { }

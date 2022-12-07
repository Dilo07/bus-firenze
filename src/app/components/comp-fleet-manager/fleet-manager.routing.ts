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
import { FleetDocumentsComponent } from './fleet-documents/fleet-documents.component';
import { FormFleetManagerComponent } from './form-fleet-manager/form-fleet-manager.component';
import { StatisticComponent } from './vehicles/page-statistic/statistic.component';
import { VehiclesComponent } from './vehicles/vehicles.component';

const routes: Routes = [
  {
    path: '', component: FleetManagerComponent, canActivate: [AuthGuard],
    data: {
      roles: [ROLES.MOVYON, ROLES.OPER_MOVYON],
      breadcrumb: [
        {
          label: 'Fleet manager',
          url: ''
        }
      ]
    }
  },
  {
    path: 'real-time',
    loadChildren: () => import('../comp-real-time/real-time.module').then(m => m.RealTimeModule),
    data: {
      breadcrumb: [
        {
          label: 'Fleet manager',
          url: '/manage'
        },
        {
          label: 'Real time',
          url: ''
        }
      ]
    }
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
    component: FormDriverComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON] }
  },
  {
    path: 'drivers',
    component: DriversComponent, canActivate: [AuthGuard],
    data: {
      roles: [ROLES.MOVYON],
      breadcrumb: [
        {
          label: 'Fleet manager',
          url: '/manage'
        },
        {
          label: 'Drivers',
          url: ''
        }
      ]
    }
  },
  {
    path: 'vehicles',
    component: VehiclesComponent, canActivate: [AuthGuard],
    data: {
      roles: [ROLES.MOVYON, ROLES.OPER_MOVYON],
      breadcrumb: [
        {
          label: 'Fleet manager',
          url: '/manage'
        },
        {
          label: 'Vehicles',
          url: ''
        }
      ]
    },
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

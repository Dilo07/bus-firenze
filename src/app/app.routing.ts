import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { RegisterComponent } from 'src/app/components/comp-fleet-manager/register-page/register.component';
import { DashboardComponent } from './components/comp-dashboard/dashboard.component';
import { ROLES } from './npt-template-menu/menu-item.service';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard], data: { roles: [ROLES.DRIVER, ROLES.FLEETMNG, ROLES.INSTALLER, ROLES.OPER_MOVYON, ROLES.MOVYON] }
  },
  { path: 'real-time', loadChildren: () => import('./components/comp-real-time/real-time.module').then(m => m.RealTimeModule) },
  {
    path: 'area-monitoring', loadChildren: () => import('@npt/npt-net').then(m => m.NptNetModule),
    canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  },
  {
    path: 'fleet-manager-manage',
    loadChildren: () => import('./components/comp-fleet-manager/fleet-manager.module').then(m => m.FleetManagerModule)
  },
  {
    path: 'fleet-manager-valid',
    loadChildren: () => import('./components/comp-fleet-manager/fleet-manager.module').then(m => m.FleetManagerModule)
  },
  {
    path: 'user-fleet-manager',
    loadChildren: () => import('./components/comp-fleet-manager/fleet-manager.module').then(m => m.FleetManagerModule)
  },
  {
    path: 'manage-obu',
    loadChildren: () => import('./components/comp-manage-obu/manage-obu.module').then(m => m.ManageObuModule)
  },
  {
    path: 'appointment',
    loadChildren: () => import('./components/comp-appointments/appointments.module').then(m => m.AppointmentsModule)
  },
  {
    path: 'user-driver',
    loadChildren: () => import('./components/comp-fleet-manager/fleet-manager.module').then(m => m.FleetManagerModule)
  },
  {
    path: 'repair-shop',
    loadChildren: () => import('./components/comp-repair-shop/repair-shop.module').then(m => m.RepairShopModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

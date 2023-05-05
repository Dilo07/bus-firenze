import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { RegisterComponent } from 'src/app/components/comp-fleet-manager/register-page/register.component';
import { DashboardComponent } from './components/comp-dashboard/dashboard.component';
import { DriveGuard } from './core/guards/driverGuard';
import { ROLES } from './npt-template-menu/menu-item.service';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard, DriveGuard], data: { roles: [ROLES.DRIVER, ROLES.FLEETMNG, ROLES.INSTALLER, ROLES.OPER_MOVYON, ROLES.MOVYON] }
  },
  /* { path: 'dashboard', loadChildren: () => import('./components/comp-dashboard/dashboard.module').then(m => m.DashboardModule) }, */
  { path: 'real-time', loadChildren: () => import('./components/comp-real-time/real-time.module').then(m => m.RealTimeModule) }, // fm
  {
    path: 'area-monitoring',
    loadChildren: () => import('@npt/npt-net').then(m => m.NptNetModule),
    canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] }
  },
  {
    path: 'manage',
    loadChildren: () => import('./components/comp-fleet-manager/fleet-manager.module').then(m => m.FleetManagerModule)
  },
  {
    path: '', // fm role -> anagraphic, vehicle
    loadChildren: () => import('./components/comp-fleet-manager/redirect-fleet-role/redirect-fleet.module').then(m => m.RedirectFleetModule)
  },
  {
    path: '', // driver role -> anagraphic, association
    loadChildren:
      () => import('./components/comp-fleet-manager/redirect-driver-role/redirect-driver-role.module').then(m => m.RedirectDriverRoleModule)
  },
  {
    path: 'user-driver', // driver role -> form
    loadChildren:
      () => import('./components/comp-fleet-manager/redirect-driver-role/redirect-driver-role.module').then(m => m.RedirectDriverRoleModule)
  },
/*   {
    path: 'deposit',
    loadChildren: () => import('./components/comp-payments/payments.module').then(m => m.PaymentsModule),
  },
  {
    path: 'billing',
    loadChildren: () => import('./components/comp-payments/payments.module').then(m => m.PaymentsModule),
  },
  {
    path: 'penalties',
    loadChildren: () => import('./components/comp-payments/payments.module').then(m => m.PaymentsModule),
  }, */
  {
    path: 'payments',
    loadChildren: () => import('./components/comp-payments/payments.module').then(m => m.PaymentsModule)
  },
  {
    path: 'validation',
    loadChildren: () => import('./components/comp-validation/valid.module').then(m => m.ValidVehiclesModule)
  },
  {
    path: 'manage-obu', // installer
    loadChildren: () => import('@npt/npt-obu').then(m => m.NptObuModule),
    canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.INSTALLER] }
  },
  {
    path: 'appointments', // installer
    loadChildren: () => import('./components/comp-appointments/appointments.module').then(m => m.AppointmentsModule)
  },
  {
    path: 'repair-shop',
    loadChildren: () => import('./components/comp-repair-shop/repair-shop.module').then(m => m.RepairShopModule)
  },
  {
    path: 'ticket',
    loadChildren: () => import('./components/comp-ticket/ticket.module').then(m => m.TicketModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./components/comp-documents/documents.module').then(m => m.DocumentsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

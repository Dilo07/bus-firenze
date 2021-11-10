import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/comp-dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'real-time', loadChildren: () => import('./components/comp-real-time/real-time.module').then(m => m.RealTimeModule) },
  { path: 'area-monitoring', loadChildren: () => import('@npt/npt-net').then(m => m.NptNetModule) },
  {
    path: 'fleet-manager',
    loadChildren: () => import('./components/comp-fleet-manager/fleet-manager.module').then(m => m.FleetManagerModule)
  },
  {
    path: 'manage-obu',
    loadChildren: () => import('./components/compo-manage-obu/manage-obu.module').then(m => m.ManageObuModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

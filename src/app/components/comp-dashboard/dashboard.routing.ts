import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { DriveGuard } from 'src/app/core/guards/driverGuard';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    canActivate: [AuthGuard, DriveGuard], data: { roles: [ROLES.DRIVER, ROLES.FLEETMNG, ROLES.INSTALLER, ROLES.OPER_MOVYON, ROLES.MOVYON] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

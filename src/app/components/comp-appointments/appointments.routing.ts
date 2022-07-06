import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from '@npt/npt-obu';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';

const routes: Routes = [
  {
    path: 'add-appointment', component: AppointmentsComponent, canActivate: [AuthGuard],
    data: { roles: [ROLES.MOVYON, ROLES.INSTALLER], hasAppointment: false }
  },
  {
    path: 'manage-appointment', component: AppointmentsComponent, canActivate: [AuthGuard],
    data: { roles: [ROLES.MOVYON, ROLES.INSTALLER], hasAppointment: true, redirectAssign: 'manage-obu' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }

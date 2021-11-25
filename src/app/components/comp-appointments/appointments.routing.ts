import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';

const routes: Routes = [
  {
    path: 'add-appointment', component: AppointmentsListComponent, canActivate: [AuthGuard],
    data: { roles: [ROLES.MOVYON, ROLES.INSTALLER], hasAppointment: false }
  },
  {
    path: 'manage-appointment', component: AppointmentsListComponent, canActivate: [AuthGuard],
    data: { roles: [ROLES.MOVYON, ROLES.INSTALLER], hasAppointment: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }

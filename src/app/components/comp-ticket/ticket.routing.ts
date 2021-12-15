import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { DriveGuard } from 'src/app/core/guards/driverGuard';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { ActiveTicketComponent } from './active-ticket/active-ticket.component';
import { ManageTicketComponent } from './manage-ticket/manage-ticket.component';

const routes: Routes = [
  { path: '', redirectTo: 'manage-ticket', pathMatch: 'full' },
  {
    path: 'manage-ticket', component: ManageTicketComponent,
    canActivate: [AuthGuard, DriveGuard], data: { roles: [ROLES.MOVYON, ROLES.FLEETMNG, ROLES.DRIVER] }
  },
  {
    path: 'active-ticket', component: ActiveTicketComponent,
    canActivate: [AuthGuard, DriveGuard], data: { roles: [ROLES.MOVYON, ROLES.FLEETMNG, ROLES.DRIVER] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }

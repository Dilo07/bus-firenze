import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { DriveGuard } from 'src/app/core/guards/driverGuard';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { PageTicketComponent } from './page-ticket.component';

const routes: Routes = [
  {
    path: '', component: PageTicketComponent,
    canActivate: [AuthGuard, DriveGuard], data: { roles: [ROLES.MOVYON, ROLES.FLEETMNG, ROLES.DRIVER] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }

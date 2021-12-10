import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { TicketComponent } from './ticket.component';

const routes: Routes = [
  { path: '', redirectTo: 'manage-ticket', pathMatch: 'full' },
  {path: 'manage-ticket', canActivate: [AuthGuard], component: TicketComponent },
  {path: 'active-ticket', canActivate: [AuthGuard], component: TicketComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }

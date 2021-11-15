import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { RealTimeComponent } from './real-time.component';

const routes: Routes = [
  { path: '', component: RealTimeComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealTimeRoutingModule { }

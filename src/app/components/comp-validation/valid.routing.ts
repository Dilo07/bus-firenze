import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { PageValidComponent } from './page-valid.component';

const routes: Routes = [
  { path: '', component: PageValidComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidVehiclesRoutingModule { }

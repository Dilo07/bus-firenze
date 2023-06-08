import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { SelectionCardValidComponent } from './selection-card-valid.component';
import { ValidFleetComponent } from './valid-fleet/valid-fleet.component';
import { ListFleetmanagerComponent } from './list-fleetManager/list-fleetmanager.component';

const routes: Routes = [
  { path: '', component: SelectionCardValidComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
  { path: 'valid-fleet', component: ValidFleetComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
  { path: 'valid-vehicle', component: ListFleetmanagerComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
  { path: 'view-deposit', component: ListFleetmanagerComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidVehiclesRoutingModule { }

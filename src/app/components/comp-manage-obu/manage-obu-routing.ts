import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { ObuComponent } from './obu.component';
import { VehicleDocumentComponent } from './vehicle-document/vehicle-document.component';

const routes: Routes = [
  { path: '', redirectTo: 'assign-obu', pathMatch: 'full' },
  { path: 'assign-obu', component: ObuComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.INSTALLER] } },
  { path: 'change-obu', component: ObuComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.INSTALLER] } },
  { path: 'change-plate', component: ObuComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.INSTALLER] } },
  { path: 'remove-obu', component: ObuComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.INSTALLER] } },
  {
    path: 'vehicle-document', component: VehicleDocumentComponent,
    canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.INSTALLER] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageObuRoutingModule { }

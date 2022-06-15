import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NptObuComponent, RouteObu, VehicleDocumentComponent, TestingObuComponent } from '@npt/npt-obu';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';

const routes: Routes = [
  { path: '', redirectTo: 'assign-obu', pathMatch: 'full' },
  {
    path: 'assign-obu', component: NptObuComponent, canActivate: [AuthGuard],
    data: { route: RouteObu.assignObu, uploadDocument: true, roles: [ROLES.MOVYON, ROLES.INSTALLER] }
  },
  {
    path: 'change-obu', component: NptObuComponent, canActivate: [AuthGuard],
    data: { route: RouteObu.changeObu, roles: [ROLES.MOVYON, ROLES.INSTALLER] }
  },
  {
    path: 'change-plate', component: NptObuComponent, canActivate: [AuthGuard],
    data: { route: RouteObu.changePlate, roles: [ROLES.MOVYON, ROLES.INSTALLER] }
  },
  {
    path: 'remove-obu', component: NptObuComponent, canActivate: [AuthGuard],
    data: { route: RouteObu.removeObu, roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.INSTALLER] }
  },
  {
    path: 'testing', component: TestingObuComponent, data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.INSTALLER] }
  },
  {
    path: 'vehicle-document', component: VehicleDocumentComponent, canActivate: [AuthGuard],
    data: { route: RouteObu.documents, roles: [ROLES.MOVYON, ROLES.INSTALLER] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageObuRoutingModule { }

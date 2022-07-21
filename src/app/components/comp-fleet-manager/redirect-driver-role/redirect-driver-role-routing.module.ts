import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { DriveGuard } from 'src/app/core/guards/driverGuard';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { AnagraphicDriverComponent } from '../drivers/anagraphic-driver/anagraphic-driver.component';
import { AssociationVehiclesComponent } from '../drivers/association-vehicles/association-vehicles.component';
import { FormDriverComponent } from '../drivers/modal-form-driver/form-driver.component';

const routes: Routes = [
  {
    path: 'anagraphic-driver',
    component: AnagraphicDriverComponent, canActivate: [AuthGuard, DriveGuard], data: { roles: [ROLES.DRIVER] }
  },
  {
    path: 'association-driver',
    component: AssociationVehiclesComponent, canActivate: [AuthGuard, DriveGuard], data: { roles: [ROLES.DRIVER] }
  },
  {
    path: 'form-Driver',
    component: FormDriverComponent, canActivate: [AuthGuard], data: { roles: [ROLES.DRIVER] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedirectDriverRoleRoutingModule { }

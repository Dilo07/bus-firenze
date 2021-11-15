import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObuComponent } from './obu.component';

const routes: Routes = [
  { path: '', redirectTo: 'assign-obu', pathMatch: 'full' },
  { path: 'assign-obu', component: ObuComponent },
  { path: 'change-obu', component: ObuComponent },
  { path: 'change-plate', component: ObuComponent },
  { path: 'remove-obu', component: ObuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageObuRoutingModule { }

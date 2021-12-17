import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepairShopComponent } from './repair-shop.component';

const routes: Routes = [
  { path: '', component: RepairShopComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepairShopRoutingModule { }

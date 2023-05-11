import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { PagePaymentsComponent } from './page-payments.component';
import { DepositComponent } from './deposit/deposit.component';
import { BillingItemsComponent } from './billing-items/billing-items.component';
import { PenaltiesComponent } from './penalties/penalties.component';
import { SelectionCardsComponent } from './selection-cards/selection-cards.component';
import { ListItemsComponent } from './billing-items/list-items/list-items.component';
import { EmittedPenaltiesComponent } from './penalties/emitted-penalties/emitted-penalties.component';

const routes: Routes = [
  { path: '', component: PagePaymentsComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] } },
  {
    path: 'selection',
    component: SelectionCardsComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] }
  },
  { path: 'deposit', component: DepositComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] } },
  { path: 'billing', component: BillingItemsComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] } },
  {
    path: 'billing-details',
    component: ListItemsComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] }
  },
  { path: 'penalties', component: PenaltiesComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
  { path: 'emitted-penalties', component: EmittedPenaltiesComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }

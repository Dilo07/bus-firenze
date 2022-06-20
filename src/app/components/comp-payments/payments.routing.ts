import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { BillingItemsComponent } from './billing-items/billing-items.component';
import { DepositComponent } from './deposit/deposit.component';
import { PenaltiesComponent } from './penalties/penalties.component';
import { RedirectMovyonComponent } from './redirect-movyon/redirect-movyon.component';

const routes: Routes = [
  { path: '', component: RedirectMovyonComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
  { path: 'dep-mov', component: DepositComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
  { path: 'bil-mov', component: BillingItemsComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
  { path: 'pen-mov', component: PenaltiesComponent, canActivate: [AuthGuard], data: { roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] } },
  { path: 'deposit', component: DepositComponent, canActivate: [AuthGuard], data: { roles: [ROLES.FLEETMNG] } },
  { path: 'billing', component: BillingItemsComponent, canActivate: [AuthGuard], data: { roles: [ROLES.FLEETMNG] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
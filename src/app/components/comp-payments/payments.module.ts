import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@npt/npt-template';
import { SharedComponentsModule } from 'src/app/shared/utils/components/shared-components.module';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes-module.module';
import { PaymentsRoutingModule } from './payments.routing';
import { DepositComponent } from './deposit/deposit.component';
import { BillingItemsComponent } from './billing-items/billing-items.component';
import { RedirectMovyonComponent } from './redirect-movyon/redirect-movyon.component';
import { PenaltiesComponent } from './penalties/penalties.component';
import { ModalPenalComponent } from './penalties/modal-penal/modal-penal.component';
import { TableItemsComponent } from './billing-items/table-items/table-items.component';


@NgModule({
  declarations: [
    DepositComponent,
    BillingItemsComponent,
    RedirectMovyonComponent,
    PenaltiesComponent,
    ModalPenalComponent,
    TableItemsComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    PipesModule
  ]
})
export class PaymentsModule { }

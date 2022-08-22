import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule, SharedLibComponentsModule } from '@npt/npt-template';
import { SharedComponentsModule } from 'src/app/shared/utils/components/shared-components.module';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes-module.module';
import { PaymentsRoutingModule } from './payments.routing';
import { DepositComponent } from './deposit/deposit.component';
import { BillingItemsComponent } from './billing-items/billing-items.component';
import { PagePaymentsComponent } from './page-payments.component';
import { PenaltiesComponent } from './penalties/penalties.component';
import { ModalPenalComponent } from './penalties/modal-penal/modal-penal.component';
import { TableItemsComponent } from './billing-items/table-items/table-items.component';
import { EmittedPenaltiesComponent } from './penalties/emitted-penalties/emitted-penalties.component';
import { AddPenaltiesComponent } from './penalties/add-penalties/add-penalties.component';


@NgModule({
  declarations: [
    DepositComponent,
    BillingItemsComponent,
    PagePaymentsComponent,
    PenaltiesComponent,
    ModalPenalComponent,
    TableItemsComponent,
    EmittedPenaltiesComponent,
    AddPenaltiesComponent
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
    SharedLibComponentsModule,
    PipesModule
  ]
})
export class PaymentsModule { }

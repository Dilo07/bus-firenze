import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule, ViewFileComponentsModule } from '@npt/npt-template';
import { SharedComponentsModule } from 'src/app/shared/utils/components/shared-components.module';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes.module';
import { PaymentsRoutingModule } from './payments.routing';
import { DepositComponent } from './deposit/deposit.component';
import { BillingItemsComponent } from './billing-items/billing-items.component';
import { PagePaymentsComponent } from './page-payments.component';
import { PenaltiesComponent } from './penalties/penalties.component';
import { ModalPenalComponent } from './penalties/modal-penal/modal-penal.component';
import { ListItemsComponent } from './billing-items/list-items/list-items.component';
import { EmittedPenaltiesComponent } from './penalties/emitted-penalties/emitted-penalties.component';
import { AddPenaltiesComponent } from './penalties/add-penalties/add-penalties.component';


@NgModule({
  declarations: [
    DepositComponent,
    BillingItemsComponent,
    PagePaymentsComponent,
    PenaltiesComponent,
    ModalPenalComponent,
    ListItemsComponent,
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
    ViewFileComponentsModule,
    PipesModule
  ]
})
export class PaymentsModule { }

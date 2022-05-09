import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@npt/npt-template';
import { SharedComponentsModule } from 'src/app/shared/utils/components/shared-components.module';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes-module.module';
import { DepositRoutingModule } from './deposit.routing';
import { DepositComponent } from './deposit/deposit.component';
import { BillingItemsComponent } from './billing-items/billing-items.component';
import { RedirectMovyonComponent } from './redirect-movyon/redirect-movyon.component';



@NgModule({
  declarations: [
    DepositComponent,
    BillingItemsComponent,
    RedirectMovyonComponent
  ],
  imports: [
    CommonModule,
    DepositRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    PipesModule
  ]
})
export class DepositModule { }

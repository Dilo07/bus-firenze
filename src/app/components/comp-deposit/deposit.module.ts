import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@npt/npt-template';
import { DepositRoutingModule } from './deposit.routing';
import { DepositComponent } from './deposit/deposit.component';



@NgModule({
  declarations: [
    DepositComponent
  ],
  imports: [
    CommonModule,
    DepositRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule
  ]
})
export class DepositModule { }

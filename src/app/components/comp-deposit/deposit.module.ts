import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@npt/npt-template';
import { SharedComponentsModule } from 'src/app/shared/utils/components/shared-components.module';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes-module.module';
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
    TranslateModule,
    SharedComponentsModule,
    PipesModule
  ]
})
export class DepositModule { }

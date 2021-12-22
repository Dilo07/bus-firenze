import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepairShopRoutingModule } from './repair-shop.routing';
import { RepairShopComponent } from './repair-shop.component';
import { MaterialModule } from '@npt/npt-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    RepairShopComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    RepairShopRoutingModule
  ]
})
export class RepairShopModule { }

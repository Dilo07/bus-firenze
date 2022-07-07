import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '@npt/npt-template';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminCardsComponent } from './admin-cards/admin-cards.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AdminCardsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    FlexLayoutModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }

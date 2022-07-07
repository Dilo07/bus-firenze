import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '@npt/npt-template';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminCardsComponent } from './admin-cards/admin-cards.component';
import { OperatorCardsComponent } from './operator-cards/operator-cards.component';
import { FleetCardsComponent } from './fleet-cards/fleet-cards.component';
import { InstallerCardsComponent } from './installer-cards/installer-cards.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AdminCardsComponent,
    OperatorCardsComponent,
    FleetCardsComponent,
    InstallerCardsComponent
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

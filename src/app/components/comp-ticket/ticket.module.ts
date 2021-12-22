import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@npt/npt-template';
import { ActiveTicketComponent } from './active-ticket/active-ticket.component';
import { ManageTicketComponent } from './manage-ticket/manage-ticket.component';
import { TicketRoutingModule } from './ticket.routing';
import { ModalTestTicketComponent } from './modal-test-ticket/modal-test-ticket.component';
import { TableFleetComponent } from './table-fleet/table-fleet.component';

@NgModule({
  declarations: [
    ManageTicketComponent,
    ActiveTicketComponent,
    ModalTestTicketComponent,
    TableFleetComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class TicketModule { }

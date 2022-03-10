import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@npt/npt-template';
import { ManageTicketComponent } from './manage-ticket/manage-ticket.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { TicketRoutingModule } from './ticket.routing';
import { ModalTestTicketComponent } from './modal-test-ticket/modal-test-ticket.component';
import { TableFleetComponent } from './table-fleet/table-fleet.component';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes-module.module';

@NgModule({
  declarations: [
    AddTicketComponent,
    ManageTicketComponent,
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
    TranslateModule,
    PipesModule
  ]
})
export class TicketModule { }

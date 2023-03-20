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
import { PipesModule } from 'src/app/shared/utils/pipes/pipes.module';
import { SharedComponentsModule } from 'src/app/shared/utils/components/shared-components.module';
import { PageTicketComponent } from './page-ticket.component';
import { ManageTicketRefComponent } from './manage-ticket-ref/manage-ticket-ref.component';

@NgModule({
  declarations: [
    AddTicketComponent,
    ManageTicketComponent,
    ModalTestTicketComponent,
    PageTicketComponent,
    ManageTicketRefComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PipesModule,
    SharedComponentsModule
  ]
})
export class TicketModule { }

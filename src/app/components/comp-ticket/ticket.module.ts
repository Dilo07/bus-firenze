import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbNptModule, MaterialModule } from '@npt/npt-template';
import { TicketRoutingModule } from './ticket.routing';
import { ModalTestTicketComponent } from './modal-test-ticket/modal-test-ticket.component';
import { PipesModule } from 'src/app/shared/utils/pipes/pipes.module';
import { SharedComponentsModule } from 'src/app/shared/utils/components/shared-components.module';
import { PageTicketComponent } from './page-ticket.component';
import { ManageTicketComponent } from './manage-ticket/manage-ticket.component';

@NgModule({
  declarations: [
    ModalTestTicketComponent,
    PageTicketComponent,
    ManageTicketComponent
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
    SharedComponentsModule,
    BreadcrumbNptModule
  ]
})
export class TicketModule { }

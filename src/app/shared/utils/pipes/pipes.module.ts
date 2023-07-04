import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DateValidPipe, DocumentRemoveObu, DocumentToValidPipe,
  DocumentTypeFind,
  HasDepositPipe, HasRequestDepositPipe, RequestDateValidPipe
} from './deposit.pipe';
import { FindContactValuePipe } from './find-contact-value.pipe';
import { SingleDatePipe } from './single-date.pipe';
import { StatusVehiclePipe } from './status-vehicle.pipe';

@NgModule({
  declarations: [
    FindContactValuePipe,
    HasDepositPipe,
    HasRequestDepositPipe,
    DateValidPipe,
    DocumentToValidPipe,
    RequestDateValidPipe,
    DocumentRemoveObu,
    DocumentTypeFind,
    SingleDatePipe,
    StatusVehiclePipe
  ],
  imports: [CommonModule],
  exports: [
    FindContactValuePipe,
    HasDepositPipe,
    HasRequestDepositPipe,
    DateValidPipe,
    DocumentToValidPipe,
    RequestDateValidPipe,
    DocumentRemoveObu,
    DocumentTypeFind,
    SingleDatePipe,
    StatusVehiclePipe
  ]
})
export class PipesModule { }

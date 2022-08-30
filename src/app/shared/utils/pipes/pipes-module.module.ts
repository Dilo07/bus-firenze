import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DateValidPipe, DocumentRemoveObu, DocumentRemoveObuFail, DocumentRemoveObuFree, DocumentToValidPipe,
  HasDepositPipe, HasRequestDepositPipe, RequestDateValidPipe
} from './deposit.pipe';
import { FindContactValuePipe } from './find-contact-value.pipe';

@NgModule({
  declarations: [
    FindContactValuePipe,
    HasDepositPipe,
    HasRequestDepositPipe,
    DateValidPipe,
    DocumentToValidPipe,
    RequestDateValidPipe,
    DocumentRemoveObu,
    DocumentRemoveObuFree,
    DocumentRemoveObuFail
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
    DocumentRemoveObuFree,
    DocumentRemoveObuFail
  ]
})
export class PipesModule { }

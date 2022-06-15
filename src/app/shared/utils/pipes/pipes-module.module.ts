import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindContactValuePipe } from './find-contact-value.pipe';
import { DateValidPipe, DocumentToValidPipe, HasDepositPipe, HasRequestDepositPipe, RequestDateValidPipe, DocumentRemoveObu } from './deposit.pipe';

@NgModule({
  declarations: [
    FindContactValuePipe,
    HasDepositPipe,
    HasRequestDepositPipe,
    DateValidPipe,
    DocumentToValidPipe,
    RequestDateValidPipe,
    DocumentRemoveObu
  ],
  imports: [CommonModule],
  exports: [
    FindContactValuePipe,
    HasDepositPipe,
    HasRequestDepositPipe,
    DateValidPipe,
    DocumentToValidPipe,
    RequestDateValidPipe,
    DocumentRemoveObu
  ]
})
export class PipesModule { }

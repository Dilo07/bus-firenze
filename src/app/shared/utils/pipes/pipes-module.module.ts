import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindContactValuePipe } from './find-contact-value.pipe';
import { DateValidPipe, HasDepositPipe, HasRequestDepositPipe } from './deposit.pipe';

@NgModule({
  declarations: [FindContactValuePipe, HasDepositPipe, HasRequestDepositPipe, DateValidPipe],
  imports: [CommonModule],
  exports: [FindContactValuePipe, HasDepositPipe, HasRequestDepositPipe, DateValidPipe]
})
export class PipesModule { }

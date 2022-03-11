import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindContactValuePipe } from './find-contact-value.pipe';
import { HasDepositPipe } from './has-deposit.pipe';



@NgModule({
  declarations: [FindContactValuePipe, HasDepositPipe],
  imports: [CommonModule],
  exports: [FindContactValuePipe, HasDepositPipe]
})
export class PipesModule { }

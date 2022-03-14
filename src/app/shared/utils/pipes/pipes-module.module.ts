import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindContactValuePipe } from './find-contact-value.pipe';
import { HasDepositPipe, HasRequestDepositPipe } from './has-deposit.pipe';



@NgModule({
  declarations: [FindContactValuePipe, HasDepositPipe, HasRequestDepositPipe],
  imports: [CommonModule],
  exports: [FindContactValuePipe, HasDepositPipe, HasRequestDepositPipe]
})
export class PipesModule { }

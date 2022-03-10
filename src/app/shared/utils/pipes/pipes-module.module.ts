import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindContactValuePipe } from './find-contact-value.pipe';



@NgModule({
  declarations: [FindContactValuePipe],
  imports: [CommonModule],
  exports: [FindContactValuePipe]
})
export class PipesModule { }

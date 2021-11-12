import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    BrowserModule
  ]
})
export class RegisterModule { }

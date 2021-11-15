import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@npt/npt-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterRoutingModule } from './register.routing';
import { FleetManagerModule } from '../comp-fleet-manager/fleet-manager.module';

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FleetManagerModule,
    MaterialModule,
    FlexLayoutModule
  ],
  bootstrap: [RegisterComponent]
})
export class RegisterModule { }

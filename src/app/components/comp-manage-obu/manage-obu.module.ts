import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@npt/npt-template';
import { ManageObuRoutingModule } from './manage-obu-routing';
import { ObuComponent } from './obu.component';


@NgModule({
  declarations: [
    ObuComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ManageObuRoutingModule
  ]
})
export class ManageObuModule { }

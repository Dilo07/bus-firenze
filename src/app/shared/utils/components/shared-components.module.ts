import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@npt/npt-template';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TableFleetComponent } from './table-fleet/table-fleet.component';
import { PipesModule } from '../pipes/pipes-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TableFleetComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  exports: [
    TableFleetComponent
  ]
})
export class SharedComponentsModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@npt/npt-template';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ManageObuRoutingModule } from './manage-obu-routing';

@NgModule({
  imports: [
    CommonModule,
    ManageObuRoutingModule
  ]
})
export class ManageObuModule { }

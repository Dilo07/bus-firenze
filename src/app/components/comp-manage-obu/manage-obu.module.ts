import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@npt/npt-template';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ManageObuRoutingModule } from './manage-obu-routing';
import { ModalObuComponent } from './modal-obu/modal-obu.component';
import { ObuComponent } from './obu.component';


@NgModule({
  declarations: [
    ObuComponent,
    ModalObuComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ManageObuRoutingModule,
    ZXingScannerModule
  ]
})
export class ManageObuModule { }

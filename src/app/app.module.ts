import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/comp-dashboard/dashboard.component';
import { ConfigInitService, getPropertyFromConfig, MaterialModule, TemplateNptModule } from '@npt/npt-template';
import { MenuItemService } from './npt-template-menu/menu-item.service';
import { environment } from 'src/environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ModalConfirmComponent
  ],
  imports: [
    TemplateNptModule,
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    { provide: 'repair_shop', useValue: 'repair_shop'},
    {
      provide: 'repair_shopData',
      useFactory: getPropertyFromConfig, multi: false, deps: ['repair_shop', ConfigInitService]
    },
    { provide: 'hideActiveTicket', useValue: 'hideActiveTicket'},
    {
      provide: 'hideActiveTicketData',
      useFactory: getPropertyFromConfig, multi: false, deps: ['hideActiveTicket', ConfigInitService]
    },
    // npt-net
    { provide: 'viewOuter', useValue: 'viewOuter'},
    {
      provide: 'viewOuterData',
      useFactory: getPropertyFromConfig, multi: false, deps: ['viewOuter', ConfigInitService]
    },
    { provide: 'net-geometry', useValue: 'Polygon' },  // Polygon, LineString, Point, MultiSelection
    // npt template
    { provide: 'menuService', useClass: MenuItemService },
    { provide: 'header', useValue: environment.header },
    { provide: 'footer', useValue: environment.footer },
    { provide: 'dashboard', useValue: '/dashboard'},
    { provide: 'env', useValue: environment.security },
    { provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

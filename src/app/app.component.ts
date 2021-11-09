import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private translateService: TranslateService
  ) { this.setI18n(); }

  private setI18n(): void {
    this.translateService.addLangs(['it', 'en']);
    this.translateService.setDefaultLang('it');
    this.translateService.use('it');
  }
}



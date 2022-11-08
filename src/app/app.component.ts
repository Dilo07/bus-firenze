import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IAuthenticationService, SessionService } from '@npt/npt-template';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private translateService: TranslateService,
    private sessionService: SessionService,
    @Inject('authService') private authService: IAuthenticationService
  ) { this.setI18n(); this.cleanSession();}

  private setI18n(): void {
    this.translateService.addLangs(['it', 'en']);
    this.translateService.setDefaultLang('it');
    this.translateService.use('it');
  }

  private cleanSession(): void {
    this.authService.getEventLogout().subscribe(
      (logout) => {
        if (logout) { // quando fa il logout cancella tutto la session storage
          this.sessionService.deleteAllSessionStorage();
          this.sessionService.deleteAllSessionMemory();
        }
      }
    );
  }
}



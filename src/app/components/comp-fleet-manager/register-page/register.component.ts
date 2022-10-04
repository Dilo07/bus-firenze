import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecaptchaTokenService } from '@npt/npt-template';


@Component({
  templateUrl: './register.component.html',
  styles: [``]
})
export class RegisterComponent implements OnInit {
  public langs: string[];
  public captchaToken: string;

  constructor(
    public translateService: TranslateService,
    private recaptchaTokenService: RecaptchaTokenService,
    @Inject('static_pageData') public staticPage: boolean) {
  }

  ngOnInit(): void {
    this.recaptchaTokenService.loadToken(document, 'register').then((captchaToken) => this.captchaToken = captchaToken);
    /* this.captchaToken = this.recaptchaTokenService.getToken('register'); altro metodo con await sulla loadToken*/
    this.langs = this.translateService.getLangs();
  }

  /* Change current language */
  public changeLang(lang: string): void {
    this.translateService.use(lang);
  }
}




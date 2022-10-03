import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const recaptchaUrl = 'https://www.google.com/recaptcha/enterprise.js?render=6LdiEkMiAAAAAJKC6CZfGhRS0FIGNs3kPLhQ2hpO';
declare var grecaptcha: any;
@Component({
  templateUrl: './register.component.html',
  styles: [``]
})
export class RegisterComponent implements OnInit {
  public langs: string[];
  public captchaToken: string;

  constructor(
    public translateService: TranslateService,
    @Inject('static_pageData') public staticPage: boolean) {
  }

  ngOnInit(): void {
    let chatScript = document.createElement("script");
    chatScript.type = "text/javascript";
    chatScript.async = true;
    chatScript.src = recaptchaUrl;
    chatScript.id = 'grecaptcha'
    document.body.appendChild(chatScript);

    chatScript.addEventListener('load', () => {
      this.loadToken();
    });
    this.langs = this.translateService.getLangs();
  }

  /* Change current language */
  public changeLang(lang: string): void {
    this.translateService.use(lang);
  }

  private loadToken() {
    grecaptcha.enterprise.ready(() => {
      grecaptcha.enterprise.execute('6LdiEkMiAAAAAJKC6CZfGhRS0FIGNs3kPLhQ2hpO', { action: 'register' }).then((token) => {
        this.captchaToken = token;
      });
    });
  }
}




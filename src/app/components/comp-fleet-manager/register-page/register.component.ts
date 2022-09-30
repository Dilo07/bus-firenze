import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

const recaptchaUrl = 'https://www.google.com/recaptcha/enterprise.js?render=6LdiEkMiAAAAAJKC6CZfGhRS0FIGNs3kPLhQ2hpO';

@Component({
  templateUrl: './register.component.html',
  styles: [``]
})
export class RegisterComponent implements OnInit, AfterViewInit {
  public langs: string[];
  public captchaToken: string;

  constructor(
    public translateService: TranslateService,
    @Inject('static_pageData') public staticPage: boolean) {
  }

  ngOnInit(): void {
    const node = document.createElement('script');
    node.src = recaptchaUrl;
    document.getElementsByTagName('head')[0].appendChild(node);
    this.langs = this.translateService.getLangs();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.loadToken(), 500);
  }

  /* Change current language */
  public changeLang(lang: string): void {
    this.translateService.use(lang);
  }

  private loadToken(): void {
    grecaptcha.enterprise.ready(() => {
      grecaptcha.enterprise.execute('6LdiEkMiAAAAAJKC6CZfGhRS0FIGNs3kPLhQ2hpO', { action: 'register' }).then((token) => {
        this.captchaToken = token;
      });
    });
  }
}

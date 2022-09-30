import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const url = 'https://www.google.com/recaptcha/enterprise.js?render=6LdiEkMiAAAAAJKC6CZfGhRS0FIGNs3kPLhQ2hpO';

@Component({
  templateUrl: './register.component.html',
  styles: [``]
})
export class RegisterComponent implements OnInit {
  public langs: string[];
  public first = false;

  constructor(
    public translateService: TranslateService,
    /* private recaptchaV3Service: ReCaptchaV3Service, */
    @Inject('static_pageData') public staticPage: boolean) {
    /* System.import('https://www.google.com/recaptcha/enterprise.js?render=6LdiEkMiAAAAAJKC6CZfGhRS0FIGNs3kPLhQ2hpO').then(refToLoadedModule => {
      refToLoadedModule.someFunction();
    }); */
    /*  grecaptcha.enterprise.ready(function () {
       grecaptcha.enterprise.execute('6LdiEkMiAAAAAJKC6CZfGhRS0FIGNs3kPLhQ2hpO', { action: 'login' }).then(function (token) {
       });
     }); */
  }

  @HostListener('mousemove') mouseenter(): void {
    if(!this.first){
      grecaptcha.enterprise.ready(() => {
        grecaptcha.enterprise.execute('6LdiEkMiAAAAAJKC6CZfGhRS0FIGNs3kPLhQ2hpO', { action: 'register' }).then((token) => {
          console.log(token);
        });
      });
      this.first = true;
    }
  }

  ngOnInit(): void {
    const node = document.createElement('script');
    node.src = url;
    document.getElementsByTagName('head')[0].appendChild(node);
    this.langs = this.translateService.getLangs();
  }

  /* Change current language */
  public changeLang(lang: string): void {
    this.translateService.use(lang);
  }
}

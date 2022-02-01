import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './register.component.html',
  styles: [``]
})
export class RegisterComponent implements OnInit {
  public langs: string[];

  constructor(
    private translateService: TranslateService,
    @Inject('static_pageData') public staticPage: boolean) { }

  ngOnInit(): void {
    this.langs = this.translateService.getLangs();
  }

  /* Get current language */
  public getLang(): string {
    return this.translateService.currentLang;
  }

  /* Change current language */
  public changeLang(lang: string): void {
    this.translateService.use(lang);
  }
}

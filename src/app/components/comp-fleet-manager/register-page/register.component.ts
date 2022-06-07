import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './register.component.html',
  styles: [``]
})
export class RegisterComponent implements OnInit {
  public langs: string[];

  constructor(
    public translateService: TranslateService,
    @Inject('static_pageData') public staticPage: boolean) { }

  ngOnInit(): void {
    this.langs = this.translateService.getLangs();
  }

  /* Change current language */
  public changeLang(lang: string): void {
    this.translateService.use(lang);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect-movyon',
  template: `
    <p>
      redirect-movyon works!
    </p>
  `,
  styles: [
  ]
})
export class RedirectMovyonComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    const url = this.router.url;
    console.log(this.router.url);
    if(url === '/deposit'){
      this.router.navigate(['deposit/deposit']);
    }
    if(url === '/billing'){
      this.router.navigate(['billing/billing']);
    }
  }

}

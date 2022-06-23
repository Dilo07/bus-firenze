import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect-movyon',
  template: ``,
  styles: [
  ]
})
export class RedirectMovyonComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    const url = this.router.url;
    if(url === '/deposit'){
      this.router.navigate(['deposit/dep-mov']);
    }
    if(url === '/billing'){
      this.router.navigate(['billing/bil-mov']);
    }
    if(url === '/penalties'){
      this.router.navigate(['penalties/pen-mov']);
    }
  }

}

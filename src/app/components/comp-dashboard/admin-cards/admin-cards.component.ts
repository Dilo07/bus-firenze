import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-cards',
  templateUrl: './admin-cards.component.html',
  styles: [`
  .border-icon {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 15px;
    width: 42px;
    height: 42px;
  }
  .font-size {
    font-size: 40px;
  }
  `]
})
export class AdminCardsComponent {

  constructor() { }

}

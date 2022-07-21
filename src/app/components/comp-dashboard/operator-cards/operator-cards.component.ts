import { Component } from '@angular/core';

@Component({
  selector: 'app-operator-cards',
  templateUrl: './operator-cards.component.html',
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
export class OperatorCardsComponent {

  constructor() { }

}

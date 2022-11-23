import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-expansion-info',
  templateUrl: './expansion-info.component.html',
  styles: [`
  .link {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
  .mat-expansion-panel {
    width: 97%;
    background-color: #E4F1F5;
  }
  `
  ]
})
export class ExpansionInfoComponent {
  @Output() private callForm = new EventEmitter();

  constructor() { }

  public downloadTemplate(): void {
    this.callForm.emit();
  }
}

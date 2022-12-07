import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-penalties',
  templateUrl: './penalties.component.html',
  styles: [``]
})
export class PenaltiesComponent {
  @Input() public fleetManagerId: number;

  public keyword = '';
  public filter = '';

  constructor() { }

  public applyFilter(event: Event): void {
    this.filter = (event.target as HTMLInputElement).value;
  }
}

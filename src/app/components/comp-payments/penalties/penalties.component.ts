import { Component } from '@angular/core';

@Component({
  selector: 'app-penalties',
  templateUrl: './penalties.component.html',
  styles: [`` ]
})
export class PenaltiesComponent {

  public viewFleetTable = true;
  public filter = '';
  public fleetId: number;

  constructor( ) { }

  public applyFilter(event: Event): void {
    this.filter = (event.target as HTMLInputElement).value;
  }
}

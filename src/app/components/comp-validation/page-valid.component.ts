import { Component, ViewChild } from '@angular/core';
import { ListFleetmanagerComponent } from './verify-vehicles/list-fleetmanager.component';

@Component({
  selector: 'app-page-valid',
  templateUrl: './page-valid.component.html',
  styles: [
  ]
})
export class PageValidComponent {
  @ViewChild(ListFleetmanagerComponent) private listFleet: ListFleetmanagerComponent;

  constructor() { }

  public onTabChanged(): void {
    // chiudo la finestra del pdf view file se è aperta
    if (this.listFleet.src.type) {
      this.listFleet.src = { type: '', url: '' };
    }
  }
}

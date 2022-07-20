import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListFleetmanagerComponent } from './verify-vehicles/list-fleetmanager.component';

@Component({
  selector: 'app-page-valid',
  templateUrl: './page-valid.component.html',
  styles: [
  ]
})
export class PageValidComponent {
  @ViewChild(ListFleetmanagerComponent) private listFleet: ListFleetmanagerComponent;
  public index = 0;

  constructor(
    private router: Router
  ) {
    this.index = this.router.getCurrentNavigation()?.extras.state?.index as number;
  }

  public onTabChanged(): void {
    // chiudo la finestra del pdf view file se è aperta
    if (this.listFleet.src.type) {
      this.listFleet.src = { type: '', url: '' };
    }
  }
}

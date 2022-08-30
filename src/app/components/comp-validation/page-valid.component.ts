import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ListFleetmanagerComponent } from './verify-vehicles/list-fleetmanager.component';

@Component({
  selector: 'app-page-valid',
  templateUrl: './page-valid.component.html',
  styles: []
})
export class PageValidComponent {
  @ViewChild(ListFleetmanagerComponent) private listFleet: ListFleetmanagerComponent;
  public index: number;

  constructor(
    private router: Router
  ) {
    // se arriva l'index dalla dashboard valorizza altrimenti mette 0
    this.index = this.router.getCurrentNavigation()?.extras.state?.index ? this.router.getCurrentNavigation()?.extras.state?.index : 0;
  }

  public onTabChanged(event: MatTabChangeEvent): void {
    this.index = event.index;
    // chiudo la finestra del pdf view file se è aperta
    if (this.listFleet?.src.type) {
      this.listFleet.src = { type: '', url: '', fileName: '' };
    }
  }
}

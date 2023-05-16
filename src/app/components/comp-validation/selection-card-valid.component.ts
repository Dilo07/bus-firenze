import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ListFleetmanagerComponent } from './list-fleetManager/list-fleetmanager.component';
import { SelectionCards } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-page-valid',
  templateUrl: './selection-card-valid.component.html',
  styles: []
})
export class SelectionCardValidComponent {
  @ViewChild(ListFleetmanagerComponent) private listFleet: ListFleetmanagerComponent;
  public index: number;
  public selectionCards: SelectionCards[] = [];

  constructor(
    private router: Router
  ) {
    // se arriva l'index dalla dashboard valorizza altrimenti mette 0
    this.index = this.router.getCurrentNavigation()?.extras.state?.index ? this.router.getCurrentNavigation()?.extras.state?.index : 0;
    this.selectionCards = [
      {
        icon: 'icon-Check-rounded',
        title: 'MENU.Valid-Fleet-manager',
        subtitle: 'Valida i fleet manager che hanno effettuato la registrazione',
        route: 'valid-fleet',
      },
      {
        icon: 'icon-Check-rounded',
        title: 'MENU.Vehicle-valid',
        subtitle: 'Valida i veicoli che sono stati registrati',
        route: 'valid-vehicle',
        state: { depositWarning: false }
      },
      {
        icon: 'icon-Deposito',
        title: 'MENU.Deposit-valid',
        subtitle: 'Visualizza i depositi da inserire',
        route: 'view-deposit',
        state: { depositWarning: true }
      }
    ];
  }

  public onTabChanged(event: MatTabChangeEvent): void {
    this.index = event.index;
    // chiudo la finestra del pdf view file se è aperta
    if (this.listFleet?.src.type) {
      this.listFleet.src = { type: '', url: '', fileName: '' };
    }
  }
}

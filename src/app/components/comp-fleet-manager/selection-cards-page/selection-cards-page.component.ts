import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-selection-cards-page',
  templateUrl: './selection-cards-page.component.html',
  styles: [
  ]
})
export class SelectionCardsPageComponent {
  public fleetManager: FleetManager;
  public selectionCards = [];

  constructor(
    private router: Router
  ) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.selectionCards = [
      {
        icon: 'icon-Profile',
        title: 'Informazioni',
        subtitle: 'Gestisci e modifico la informazioni del fleet manager',
        route: 'form-Fleet',
        state: { fleetManager: this.fleetManager }
      },
      {
        icon: 'icon-driver',
        title: 'Autisti',
        subtitle: 'Gestisci gli autisti associati ai veicoli',
        route: 'drivers',
        state: { fleetManagerId: this.fleetManager.id }
      },
      {
        icon: 'icon-Car',
        title: 'Veicoli',
        subtitle: 'Gestisci i veicoli associati al fleet manager',
        route: 'vehicles',
        state: { fleetManager: this.fleetManager }
      },
      {
        icon: 'icon-Pin',
        title: 'Real time',
        subtitle: 'Visualizza i veicoli in tempo reale',
        route: 'real-time',
        state: { fleetManager: this.fleetManager }
      },
      {
        icon: 'icon-Documents',
        title: 'Documenti cartacei',
        subtitle: 'Gestisci i documenti cartacei del fleet manager',
        route: 'fleet-documents',
        state: { fmId: this.fleetManager.id, documents: this.fleetManager.documents }
      }
    ];
  }

}

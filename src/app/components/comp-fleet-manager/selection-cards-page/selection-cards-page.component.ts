import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FleetManager, SelectionCards } from '../../domain/bus-firenze-domain';
import { Breadcrumb } from '@npt/npt-template';

@Component({
  selector: 'app-selection-cards-page',
  templateUrl: './selection-cards-page.component.html',
  styles: [
  ]
})
export class SelectionCardsPageComponent {
  public fleetManager: FleetManager;
  public selectionCards: SelectionCards[] = [];
  public breadCrumb: Breadcrumb[] = [];

  constructor(
    private router: Router
  ) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    if (this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb as FleetManager) {
      this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb.fleetManager;
    };
    this.breadCrumb = [
      {
        label: 'Fleet manager',
        url: '/manage'
      },
      {
        label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
        url: ''
      }
    ];
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
        state: { fleetManager: this.fleetManager }
      },
      {
        icon: 'icon-Car',
        title: 'Veicoli',
        subtitle: 'Gestisci i veicoli associati al fleet manager',
        route: 'vehicles',
        state: { fleetManager: this.fleetManager }
      },
      {
        icon: 'icon-Documents',
        title: 'Pagamenti',
        subtitle: 'Gestisci i pagamenti associati al fleet manager',
        route: '../payments/selection',
        state: { fleetManager: this.fleetManager, fromFleet: true }
      },
      {
        icon: 'icon-Pin',
        title: 'Real time',
        subtitle: 'Visualizza i veicoli in tempo reale',
        route: 'real-time',
        state: { fleetManager: this.fleetManager }
      },
      {
        icon: 'icon-Pin',
        title: 'Ticket',
        subtitle: 'Visualizza i ticket del fleet manager',
        route: '../ticket',
        state: { fleetManager: this.fleetManager, fromFleet: true  }
      },
      {
        icon: 'icon-Documents',
        title: 'Documenti cartacei',
        subtitle: 'Gestisci i documenti cartacei del fleet manager',
        route: 'fleet-documents',
        state: { fleetManager: this.fleetManager }
      }
    ];
  }
}

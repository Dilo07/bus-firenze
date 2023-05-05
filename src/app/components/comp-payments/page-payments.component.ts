import { Component, Inject, OnInit } from '@angular/core';
import { IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManager } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-redirect-movyon',
  templateUrl: './page-payments.component.html',
  styles: [
  ]
})
export class PagePaymentsComponent implements OnInit {
  public roleMovyon: boolean;
  public roleFleet: boolean;
  public viewFleetTable = false;
  public fleetSelect: FleetManager;
  public index = 0;
  public selectionCards = [];

  constructor(
    @Inject('authService') private authService: IAuthenticationService,
    @Inject('hideBillingData') public hideBilling: boolean
  ) {  }

  async ngOnInit(): Promise<void> {
    // verifica il ruolo loggato
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON) || res.includes(ROLES.OPER_MOVYON));
    await this.authService.getUserRoles().then((res: string[]) => this.roleFleet = res.includes(ROLES.FLEETMNG));
    this.selectionCards = [
      {
        icon: 'icon-Deposito',
        title: 'Depositi',
        subtitle: 'Visualizza tutti i depositi dei veicoli',
        route: 'deposit'
      }
    ];
    if (!this.hideBilling) { // se la property hideBilling è falsa
      this.selectionCards.push({
        icon: 'icon-Documents',
        title: 'Fatture',
        subtitle: 'Visualizza tutte le fatture',
        route: 'billing'
      });
    }
    if (this.roleMovyon) { // se è un operatore o admin
      this.viewFleetTable = true;
      this.selectionCards.push({
        icon: 'icon-Penali',
        title: 'Penali',
        subtitle: 'Gestisci tuttel le penali',
        route: 'penalties'
      });
    }
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { Breadcrumb, IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManager, SelectionCards } from '../../domain/bus-firenze-domain';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection-cards',
  templateUrl: './selection-cards.component.html',
  styleUrls: ['./selection-cards.component.css']
})
export class SelectionCardsComponent implements OnInit {
  public roleMovyon: boolean;
  public roleFleet: boolean;
  public selectionCards: SelectionCards[] = [];
  public fleetManager: FleetManager;
  public fromFleet: boolean;
  public breadCrumb: Breadcrumb[] = [];

  constructor(
    private router: Router,
    @Inject('authService') private authService: IAuthenticationService,
    @Inject('hideBillingData') public hideBilling: boolean
  ) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.fromFleet = this.router.getCurrentNavigation()?.extras.state?.fromFleet as boolean;
    if (this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb as FleetManager) {
      this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb;
    };
  }

  async ngOnInit(): Promise<void> {
    // verifica il ruolo loggato
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON) || res.includes(ROLES.OPER_MOVYON));
    await this.authService.getUserRoles().then((res: string[]) => this.roleFleet = res.includes(ROLES.FLEETMNG));
    this.selectionCards = [
      {
        icon: 'icon-Deposito',
        title: 'MENU.Deposit',
        subtitle: 'Visualizza tutti i depositi dei veicoli',
        route: 'deposit',
        state: { fleetManager: this.fleetManager }
      }
    ];
    if (!this.hideBilling) { // se la property hideBilling è falsa
      this.selectionCards.push({
        icon: 'icon-Documents',
        title: 'MENU.Billing',
        subtitle: 'Visualizza tutte le fatture',
        route: 'billing',
        state: { fleetManager: this.fleetManager }
      });
    }
    if (this.roleMovyon) { // se è un operatore o admin
      this.selectionCards.push({
        icon: 'icon-Penali',
        title: 'MENU.Penalties',
        subtitle: 'Gestisci tutte le penali',
        route: 'penalties',
        state: { fleetManager: this.fleetManager }
      });
      this.breadCrumb = [
        {
          label: this.fromFleet ? 'MENU.Fleet-manager' : 'MENU.Payments',
          url: this.fromFleet ? '../../manage/selection-card' : '/payments',
          state: { fleetManager: this.fleetManager }
        },
        {
          label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
          url: ''
        }
      ];
    }
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManager } from '../domain/bus-firenze-domain';
import { Router } from '@angular/router';
import { FIRENZE_SESSION } from 'src/app/shared/constants/Firenze-session.constants';

@Component({
  selector: 'app-redirect-movyon',
  templateUrl: './page-payments.component.html',
  styles: [
  ]
})
export class PagePaymentsComponent implements OnInit {
  public roleFleet: boolean;
  public searchFleet: string;

  constructor(
    private router: Router,
    @Inject('authService') private authService: IAuthenticationService
  ) { }

  async ngOnInit(): Promise<void> {
    // verifica il ruolo loggato
    await this.authService.getUserRoles().then((res: string[]) => this.roleFleet = res.includes(ROLES.FLEETMNG));
    if (this.roleFleet) {// se è un fm va subito alla selection cards
      this.router.navigate(['../payments/selection']);
    } else {
      this.searchFleet = sessionStorage.getItem(FIRENZE_SESSION.fleetPaymentSearch);
    }
  }

  public navigateSelection(event: FleetManager): void {
    this.router.navigate(['../payments/selection'], { state: { fleetManager: event } });
  }

  public saveFleetSearch(search: string): void {
    sessionStorage.setItem(FIRENZE_SESSION.fleetPaymentSearch, search);
  }
}

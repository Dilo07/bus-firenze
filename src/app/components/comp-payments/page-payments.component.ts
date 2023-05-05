import { Component, Inject, OnInit } from '@angular/core';
import { Breadcrumb, IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManager } from '../domain/bus-firenze-domain';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect-movyon',
  templateUrl: './page-payments.component.html',
  styles: [
  ]
})
export class PagePaymentsComponent implements OnInit {
  public roleFleet: boolean;

  constructor(
    private router: Router,
    @Inject('authService') private authService: IAuthenticationService,
    @Inject('hideBillingData') public hideBilling: boolean
  ) { }

  async ngOnInit(): Promise<void> {
    // verifica il ruolo loggato
    await this.authService.getUserRoles().then((res: string[]) => this.roleFleet = res.includes(ROLES.FLEETMNG));
    if(this.roleFleet){
      this.router.navigate(['../payments/selection']);
    }
  }

  public navigateSelection(event: FleetManager): void {
    this.router.navigate(['../payments/selection'], { state: { fleetManager: event } });
  }
}

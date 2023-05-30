import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Breadcrumb, IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManager } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-page-ticket',
  templateUrl: './page-ticket.component.html',
  styles: [``]
})
export class PageTicketComponent implements OnInit {
  public index: number;
  public roleMovyon: boolean;
  public viewFleetTable = false;
  public fleetManager: FleetManager;
  public fromFleet: boolean;
  public breadCrumb: Breadcrumb[] = [];

  constructor(
    private router: Router,
    @Inject('authService') private authService: IAuthenticationService
  ) {
    this.index = this.router.getCurrentNavigation()?.extras.state?.index ? this.router.getCurrentNavigation()?.extras.state?.index : 0;
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager;
    this.fromFleet = this.router.getCurrentNavigation()?.extras.state?.fromFleet;
  }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON));
    if (this.roleMovyon && !this.fromFleet) {
      this.viewFleetTable = true;
    }
    if (this.fromFleet) {
      this.breadCrumb = [
        {
          label: 'Fleet manager',
          url: '../manage'
        },
        {
          label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
          url: ''
        }
      ];
    }
  }

}

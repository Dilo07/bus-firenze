import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FleetManager } from '../../domain/bus-firenze-domain';
import { Breadcrumb } from '@npt/npt-template';

@Component({
  selector: 'app-penalties',
  templateUrl: './penalties.component.html',
  styles: [``]
})
export class PenaltiesComponent {
  public fleetManager: FleetManager;
  public keyword = '';
  public filter = '';
  public breadCrumb: Breadcrumb[] = [];

  constructor(private router: Router) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.breadCrumb = [
      {
        label: 'MENU.Payments',
        url: '/payments'
      },
      {
        label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
        url: '../selection',
        state: this.fleetManager
      },
      {
        label: 'MENU.Penalties',
        url: ''
      }
    ];
  }

  public applyFilter(event: Event): void {
    this.filter = (event.target as HTMLInputElement).value;
  }
}

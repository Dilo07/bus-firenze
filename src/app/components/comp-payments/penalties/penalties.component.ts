import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-penalties',
  templateUrl: './penalties.component.html',
  styles: [``]
})
export class PenaltiesComponent {
  public fleetManager: FleetManager;
  public keyword = '';
  public filter = '';

  constructor(private router: Router) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  public applyFilter(event: Event): void {
    this.filter = (event.target as HTMLInputElement).value;
  }
}

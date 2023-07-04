import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-anagraphic-fleet-manager',
  templateUrl: './anagraphic-fleet-manager.component.html',
  styles: [
  ]
})
export class AnagraphicFleetManagerComponent implements OnInit, OnDestroy {
  public fleetManager: FleetManager;
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private fleetManagerService: FleetManagerService,
  ) { }

  ngOnInit(): void {
    this.complete = false;
    this.subscription.push(this.fleetManagerService.getFleetManagerInfo().subscribe({
      next: (data) => this.fleetManager = data,
      error: () => this.complete = true,
      complete: () => this.complete = true,
    }));
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}

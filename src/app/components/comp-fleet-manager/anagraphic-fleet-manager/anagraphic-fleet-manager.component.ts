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

  private subscription: Subscription[] = [];

  constructor(
    private fleetManagerService: FleetManagerService,
  ) { }

  ngOnInit(): void {
    this.subscription.push(this.fleetManagerService.getFleetManagerInfo().subscribe(
      data => this.fleetManager = data
    ));
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}

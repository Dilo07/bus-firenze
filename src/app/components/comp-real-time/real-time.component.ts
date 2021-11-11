import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FleetManager } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-real-time',
  templateUrl: './real-time.component.html',
  styles: [``]
})
export class RealTimeComponent implements OnInit {
  public fleetManager: FleetManager;

  constructor(private router: Router) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    console.log(this.fleetManager);
  }

}

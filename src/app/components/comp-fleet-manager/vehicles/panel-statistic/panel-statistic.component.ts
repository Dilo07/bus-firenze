import { Component, Input, OnInit } from '@angular/core';
import { FleetManager } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-panel-statistic',
  templateUrl: './panel-statistic.component.html',
  styles: [`
  .vehicle {
    background-color: burlywood;
  }
  `
  ]
})
export class PanelStatisticComponent implements OnInit {
  @Input() fleetManager: FleetManager;
  public panelOpenState = false;

  constructor() { }

  ngOnInit(): void {
  }

}

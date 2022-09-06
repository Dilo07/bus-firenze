import { Component } from '@angular/core';
import { DashboardSetting } from '@npt/npt-template';
import { dashboardSettings } from '../domain/bus-firenze-constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public settings: DashboardSetting[] = dashboardSettings;

  constructor() { }

}

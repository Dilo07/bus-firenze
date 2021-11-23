import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FleetManager, TripStat } from 'src/app/components/domain/bus-firenze-domain';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { StatisticService } from 'src/app/services/statistic.service';

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
export class PanelStatisticComponent implements OnInit, OnDestroy {
  @Input() fleetManager: FleetManager;
  public panelOpenState = false;
  public tripStat: TripStat;

  private subscription: Subscription[] = [];

  constructor(
    @Inject('viewOuterData') public viewOuter: boolean,
    private statisticService: StatisticService) { }

  ngOnInit(): void {
    this.getStatistic();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  private getStatistic(): void {
    const start = moment(moment.now()).subtract(1, 'month').format('yyyy-MM-DD');
    const end = moment(moment.now()).format('yyyy-MM-DD');
    const inner = !this.viewOuter ? 'INNER' : '';
    this.subscription.push(this.statisticService.getTripInfoByFleetId(inner, start, end, this.fleetManager?.id).subscribe(
      (data) => this.tripStat = data
    ));
  }

}

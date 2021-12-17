import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FleetManager, TripStat } from 'src/app/components/domain/bus-firenze-domain';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
  public FormGroup: FormGroup;
  public start = moment(moment.now()).subtract(1, 'month');
  public end = moment(moment.now());
  public maxDate = moment(moment.now()).toDate();

  private subscription: Subscription[] = [];

  constructor(
    @Inject('viewOuterData') public viewOuter: boolean,
    private statisticService: StatisticService) { }

  ngOnInit(): void {
    this.FormGroup = new FormGroup({
      start: new FormControl(moment(this.start).toDate(), Validators.required),
      end: new FormControl(moment(this.end).toDate(), Validators.required),
    });
    this.getStatistic();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  private getStatistic(): void {
    const start = moment(this.start).format('yyyy-MM-DD');
    const end = moment(this.end).format('yyyy-MM-DD');
    const inner = !this.viewOuter ? 'INNER' : '';
    this.subscription.push(this.statisticService.getTripInfoByFleetId(inner, start, end, this.fleetManager?.id).subscribe(
      (data) => this.tripStat = data
    ));
  }

  public changeDate(e: MatDatepickerInputEvent<any>): void {
    if (e.value && !this.FormGroup.invalid) {
      this.start = this.FormGroup.get('start').value;
      this.end = this.FormGroup.get('end').value;
      this.getStatistic();
    }
  }

}

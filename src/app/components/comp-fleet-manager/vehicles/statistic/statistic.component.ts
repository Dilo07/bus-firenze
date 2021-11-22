import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin, Subscription } from 'rxjs';
import { FleetManager, TripStat, Vehicle, VehicleTripPersistence } from 'src/app/components/domain/bus-firenze-domain';
import { StatisticService } from 'src/app/services/statistic.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styles: [
  ]
})
export class StatisticComponent implements OnInit {
  public FormGroup: FormGroup;
  public start = moment(moment.now()).subtract(1, 'day');
  public end = moment(moment.now());
  public maxDate = moment(moment.now()).toDate();
  public fleetManager: FleetManager;
  public vehicle: Vehicle;
  public complete = true;
  public vehicleStatTrip: TripStat;
  public vehicleTripPersistence: VehicleTripPersistence[];

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private statisticService: StatisticService,
    @Inject('viewOuterData') public viewOuter: boolean
  ) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.vehicle = this.router.getCurrentNavigation()?.extras.state?.vehicle as Vehicle;
  }

  ngOnInit(): void {
    this.FormGroup = new FormGroup({
      start: new FormControl(moment(this.start).toDate(), Validators.required),
      end: new FormControl(moment(this.end).toDate(), Validators.required),
    });
    this.getGraph();
  }

  private getGraph(): void {
    const start = moment(this.start).format('yyyy-MM-DD');
    const end = moment(this.end).format('yyyy-MM-DD');
    const inner = !this.viewOuter ? 'INNER' : '';
    this.complete = false;
    this.subscription.push(forkJoin({
      req1: this.statisticService.getVehicleTrip(this.vehicle.id, start, end),
      req2: this.statisticService.getVehicleTripList(this.vehicle.id, inner, start, end)
    })
      .subscribe(({ req1, req2 }) => {
        this.vehicleStatTrip = req1;
        this.vehicleTripPersistence = req2;
        /* this.drawLineTrip(); */
      },
        () => this.complete = true,
        () => this.complete = true
      ));
  }

  public changeDate(e: MatDatepickerInputEvent<any>): void {
  }
}

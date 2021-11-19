import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FleetManager, Vehicle } from 'src/app/components/domain/bus-firenze-domain';

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

  constructor(
    private router: Router
  ) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.vehicle = this.router.getCurrentNavigation()?.extras.state?.vehicle as Vehicle;
  }

  ngOnInit(): void {
    this.FormGroup = new FormGroup({
      start: new FormControl(moment(this.start).toDate(), Validators.required),
      end: new FormControl(moment(this.end).toDate(), Validators.required),
    });
  }

  public changeDate(e: MatDatepickerInputEvent<any>): void {
  }
}

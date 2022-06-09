import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NptMapComponent } from '@npt/npt-map';
import * as moment from 'moment';
import { forkJoin, Subscription } from 'rxjs';
import { FleetManager, TripStat, Vehicle, VehicleTripPersistence } from 'src/app/components/domain/bus-firenze-domain';
import { StatisticService } from 'src/app/services/statistic.service';
import { FirenzeMapUtils } from 'src/app/shared/utils/map/Firenze-map.utils';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styles: [
  ]
})
export class StatisticComponent implements OnInit {
  @ViewChild(NptMapComponent) mapChild: NptMapComponent;
  public formGroup: FormGroup;
  public start = moment(moment.now()).subtract(1, 'day');
  public end = moment(moment.now());
  public maxDate = moment(moment.now()).toDate();
  public fleetManager: FleetManager;
  public vehicle: Vehicle;
  public complete = true;
  public index = 0;
  public vehicleStatTrip: TripStat;
  public vehicleTripPersistence: VehicleTripPersistence[];
  public layersToCheck = [FirenzeMapUtils.LayerEnum.LINE_STATISTICVEHICLE];

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private statisticService: StatisticService,
    private translate: TranslateService,
    @Inject('viewOuterData') public viewOuter: boolean
  ) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.vehicle = this.router.getCurrentNavigation()?.extras.state?.vehicle as Vehicle;
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      start: new FormControl(moment(this.start).toDate(), Validators.required),
      end: new FormControl(moment(this.end).toDate(), Validators.required),
    });
    this.getGraph();
  }

  public changeDate(e: MatDatepickerInputEvent<any>): void {
    if (e.value && !this.formGroup.invalid) {
      this.start = this.formGroup.get('start').value;
      this.end = this.formGroup.get('end').value;
      /* if (this.index === 1) {
        this.index = 0;
      } */ // in caso di utilizzo chartist
      this.mapChild.removeLayers(['layerPoint']);
      this.getGraph();
    }
  }

  public tabChange(event: MatTabChangeEvent): void {
    this.index = event.index;
  }

  private getGraph(): void {
    const start = moment(this.start).format('yyyy-MM-DD');
    const end = moment(this.end).format('yyyy-MM-DD');
    const inner = !this.viewOuter ? 'INNER' : '';
    this.complete = false;
    this.subscription.push(forkJoin({
      req1: this.statisticService.getVehicleTrip(this.vehicle.id, start, end, this.fleetManager?.id),
      req2: this.statisticService.getVehicleTripList(this.vehicle.id, inner, start, end, this.fleetManager?.id)
    })
      .subscribe(
        ({ req1, req2 }) => {
          this.vehicleStatTrip = req1;
          this.vehicleTripPersistence = req2;
          this.drawLineTrip();
        },
        () => this.complete = true,
        () => this.complete = true
      ));
  }

  private drawLineTrip(): void {
    if (this.mapChild) {
      this.mapChild.removeLayers([FirenzeMapUtils.LayerEnum.LINE_STATISTICVEHICLE]);
    }

    this.vehicleTripPersistence.forEach((trip: VehicleTripPersistence) => {
      const text = this.generateLineStringText(trip);
      this.mapChild.drawLine(
        [trip.shape.points], FirenzeMapUtils.LayerEnum.LINE_STATISTICVEHICLE, FirenzeMapUtils.Style.SECTION_LINKS, text);
    });

    this.mapChild.changeFeatureColorPointEvent('click', [FirenzeMapUtils.LayerEnum.LINE_STATISTICVEHICLE],
      FirenzeMapUtils.Style.SECTION_LINKS, FirenzeMapUtils.Style.SECTION_LINKS_LIGHT);

    this.mapChild.zoomToLayer(FirenzeMapUtils.LayerEnum.LINE_STATISTICVEHICLE, 10);
  }

  private generateLineStringText(trip: VehicleTripPersistence): string {
    return `<h3>${this.translate.instant('STATISTIC.ROAD')}</h3>
    <table><tr><th>${this.translate.instant('STATISTIC.TRIP_LENGHT')}</th><th> ${this.translate.instant('STATISTIC.START')} </th>
    <th> ${this.translate.instant('STATISTIC.END')} </th><th> ${this.translate.instant('STATISTIC.DURATION')} (HH:mm:ss)</th></tr>
    <tr> <td> ${(trip.tripLength / 1000).toFixed(1)} km</td>
    <td> ${moment(trip.start).format('DD/MM/yyy HH:mm:ss')} </td> <td> ${moment(trip.end).format('DD/MM/yyy HH:mm:ss')} </td>
    <td> ${moment.utc(trip.duration * 1000).format('HH:mm:ss')} </td>
    </tr></table><hr><br>`;
  }

}

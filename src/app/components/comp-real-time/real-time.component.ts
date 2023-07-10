import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MapUtils, NptMapComponent } from '@npt/npt-map';
import { Geometry } from '@npt/npt-net';
import { Breadcrumb } from '@npt/npt-template';
import moment from 'moment';
import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import { Subscription } from 'rxjs';
import { LiveStreamService } from 'src/app/services/live-stream.service';
import { FirenzeMapUtils } from 'src/app/shared/utils/map/Firenze-map.utils';
import { TIMEREFRESH } from '../domain/bus-firenze-constants';
import { FleetManager, RefreshInterface, RefreshOption, VehicleTripPersistence } from '../domain/bus-firenze-domain';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Button } from '@npt/npt-map/lib/utils/control.utils';
import { StatusVehiclePipe } from 'src/app/shared/utils/pipes/status-vehicle.pipe';

@Component({
  selector: 'app-real-time',
  templateUrl: './real-time.component.html',
  styles: [`
  .card-real-time {
    margin: 2px;
  }
  `],
  animations: [
    trigger('slideInOut', [
      state(
        'on',
        style({
          'overflow-y': 'auto',
          'max-height': '600px',
          'max-width': '20%',
          'box-shadow': '0px 4px 16px rgba(0, 0, 0, 0.25)'
        })
      ),
      state(
        'off',
        style({
          'max-width': '2%',
          'box-shadow': '0px 4px 16px rgba(0, 0, 0, 0.25)'
        })
      ),
      transition('on => off', animate('500ms')),
      transition('off => on', animate('500ms')),
    ]),
    trigger('maxWidth', [
      state(
        'on',
        style({
          'max-width': '80%',
        })
      ),
      state(
        'off',
        style({
          'max-width': '100%',
        })
      ),
      transition('on => off', animate('500ms')),
      transition('off => on', animate('500ms')),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealTimeComponent {
  @ViewChild(NptMapComponent) mapChild: NptMapComponent;

  public fleetManager: FleetManager;
  public complete = true;
  public vehicleTrip: VehicleTripPersistence[] = [];
  public filteredTrip: VehicleTripPersistence[] = [];
  public center = [11.206119915108518, 43.81031349352526];
  public stop = true;
  public actualTime = RefreshOption.time5minutes;
  public times: RefreshInterface[] = TIMEREFRESH;
  public layersPopup = [FirenzeMapUtils.layerEnum.POINT_REAL_TIME];
  public breadCrumb: Breadcrumb[] = [];
  public detailsBar: 'on' | 'off' = 'on';

  private subscription: Subscription[] = [];
  private geometry: Geometry[] | GeoJSON[] = [];
  private interval: any;
  private map: Map;
  private activeVehicle: Button;
  private warningVehicle: Button;
  private errorVehicle: Button;

  constructor(
    private router: Router,
    private liveStreamService: LiveStreamService,
    private cdr: ChangeDetectorRef,
    private pipeStateVehicle: StatusVehiclePipe,
    private translate: TranslateService) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    this.createBreadCrumb();
  }

  public onMapReady(event: any): void {
    this.map = event;
    this.complete = false;
    this.getGeom();
    this.setMapControls();
  }

  public getTrip(): void {
    this.subscription.push(this.liveStreamService.getStreamLive(this.fleetManager?.id).subscribe({
      next: (trip) => {
        this.vehicleTrip = trip;
        this.drawLine();
      },
      error: () => (this.complete = true, this.cdr.markForCheck()),
      complete: () => (this.complete = true, this.cdr.markForCheck())
    }));
  }

  public stopPlayRefresh(): void {
    this.stop = !this.stop;
    if (!this.stop) {
      clearInterval(this.interval);
    } else {
      this.callInterval();
    }
  }

  public onChangedRefresh(): void {
    clearInterval(this.interval);
    this.callInterval();
  }

  public createBreadCrumb(): void {
    if (this.fleetManager) {
      this.breadCrumb = [
        {
          label: 'Fleet manager',
          url: '/manage'
        },
        {
          label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
          url: '../selection-card',
          state: { fleetManager: this.fleetManager }
        },
        {
          label: 'Real Time',
          url: ''
        }
      ];
    }
  }

  private getGeom(): void {
    this.subscription.push(this.liveStreamService.getGeometryLive().subscribe({
      next: (geom) => {
        this.geometry = geom;
        this.drawGeom();
      },
      error: () => (this.complete = true, this.cdr.markForCheck()),
      complete: () => this.getTrip()
    }));
  }

  private drawGeom(): void {
    this.geometry.forEach(geom => {
      this.mapChild.viewGeometry(geom, FirenzeMapUtils.layerEnum.CHARGE_POLYGON, FirenzeMapUtils.style.POLYGON_SELECTOR);
    });
    this.mapChild.zoomToLayer(FirenzeMapUtils.layerEnum.CHARGE_POLYGON, 12);
  }


  private drawLine(): void {
    this.filteredTrip = [];
    this.mapChild.removeLayers([FirenzeMapUtils.layerEnum.LINE_REAL_TIME, FirenzeMapUtils.layerEnum.POINT_REAL_TIME]);
    const attributeActive = document.getElementById('activeVehicle')?.getAttribute('selected');
    const attributeWarning = document.getElementById('warningVehicle')?.getAttribute('selected');
    const attributeError = document.getElementById('errorVehicle')?.getAttribute('selected');
    this.vehicleTrip.forEach((trip) => {
      if ((!attributeActive || attributeActive === 'selected') && this.pipeStateVehicle.transform(trip) === 'greenIcon') {
        this.filteredTrip.push(trip);
      }
      if ((!attributeWarning || attributeWarning === 'selected') && this.pipeStateVehicle.transform(trip) === 'yellowIcon') {
        this.filteredTrip.push(trip);
      }
      if ((!attributeError || attributeError === 'selected') && this.pipeStateVehicle.transform(trip) === 'redIcon') {
        this.filteredTrip.push(trip);
      }
    });
    this.filteredTrip.forEach(trip => {
      const style = this.getStyle(trip);
      this.mapChild.drawLine([trip.shape.points], FirenzeMapUtils.layerEnum.LINE_REAL_TIME, style);
    });
    this.drawPoint(this.filteredTrip);
  }

  private drawPoint(vehicleTrip: VehicleTripPersistence[]): void {
    vehicleTrip.forEach(trip => {
      const length = trip.shape.points.coordinates.length;
      // se c'è solo un punto non disegna l'arrowblue
      if (length > 1) {
        const rotation = this.calculateRotation(trip);
        const text = this.generateText(trip);
        this.mapChild.drawPoint([trip.shape.points.coordinates[length - 1].x, trip.shape.points.coordinates[length - 1].y],
          FirenzeMapUtils.layerEnum.POINT_REAL_TIME, FirenzeMapUtils.style.ARROW_BLUE(rotation), text, true);
      }
    });
    this.cdr.markForCheck();
  }

  private getStyle(trip: VehicleTripPersistence): string {
    const now = moment.now();
    const nowPlus15 = moment(now).add(15, 'minutes').valueOf();
    if (!trip.ticketNumber || trip.ticketExpiresAt < now) {
      return FirenzeMapUtils.style.SECTION_LINKS_ERROR;
    } else if (trip.ticketExpiresAt > now && trip.ticketExpiresAt < nowPlus15) {
      return FirenzeMapUtils.style.SECTION_LINKS_WARNING;
    } else {
      return FirenzeMapUtils.style.SECTION_LINKS;
    }
  }

  private calculateRotation(trip: VehicleTripPersistence): number {
    const length = trip.shape.points.coordinates.length;
    // calcola l'angolazione del marker tra gli ultimi due punti
    const dx = trip.shape.points.coordinates[length - 1].x - trip.shape.points.coordinates[length - 2].x;
    const dy = trip.shape.points.coordinates[length - 1].y - trip.shape.points.coordinates[length - 2].y;
    const rotation = -Math.atan2(dy, dx);
    return rotation;
  }

  private generateText(trip: VehicleTripPersistence): string {
    return `<table><tr><th> OBU </th><th> ${this.translate.instant('COMMON.DATE.START')} </th><th> ${this.translate.instant('COMMON.DATE.END')} </th>
        <th> ${this.translate.instant('REAL-TIME.TICKET')} </th></tr>
        <tr><td> ${trip.obuId} </td>
        <td> ${moment(trip.start).format('HH:mm:ss')} </td> <td> ${moment(trip.end).format('HH:mm:ss')} </td>
        <td> ${trip.ticketNumber ? trip.ticketNumber : this.translate.instant('REAL-TIME.NOT-FOUND')} </td>
        </tr></table><hr><br>`;
  }

  private callInterval(): void {
    let milliseconds = 1800000;
    if (!this.stop) {
      this.stop = true;
    }
    switch (this.actualTime) {
      case RefreshOption.time1minute:
        milliseconds = 60000; // 1 min
        break;
      case RefreshOption.time5minutes:
        milliseconds = 300000; // 5 min
        break;
      case RefreshOption.time10minutes:
        milliseconds = 600000; // 10 min
        break;
      case RefreshOption.time30minutes:
        milliseconds = 1800000; // 30 min
        break;
    }
    this.interval = setInterval(() => {
      this.getTrip();
    }, milliseconds);
  }

  private setMapControls(): void {
    this.activeVehicle = new MapUtils.Control.Enum.BUTTON(
      'activeVehicle',
      this.translate.instant('REAL-TIME.ACTIVEVEHICLE'),
      '40px',
      'icon-Pin-rounded',
      () => this.selectUnselectButton('activeVehicle'),
      false,
      '350px'
    );

    this.warningVehicle = new MapUtils.Control.Enum.BUTTON(
      'warningVehicle',
      this.translate.instant('REAL-TIME.WARNINGVEHICLE'),
      '40px',
      'icon-Pin-rounded',
      () => this.selectUnselectButton('warningVehicle'),
      false,
      '500px'
    );

    this.errorVehicle = new MapUtils.Control.Enum.BUTTON(
      'errorVehicle',
      this.translate.instant('REAL-TIME.ERRORVEHICLE'),
      '40px',
      'icon-Pin-rounded',
      () => this.selectUnselectButton('errorVehicle'),
      false,
      '700px'
    );

    MapUtils.Control.SetControls(this.map, [this.activeVehicle, this.warningVehicle, this.errorVehicle]);
  }

  private selectUnselectButton(id: string): void {
    const element = document.getElementById(id);
    const attribute = element.getAttribute('selected');
    if (!attribute || attribute === 'selected') {
      element.setAttribute('selected', 'unselected');
      document.getElementById(id).style.opacity = '0.64';
    } else if (attribute === 'unselected') {
      element.setAttribute('selected', 'selected');
      document.getElementById(id).style.opacity = '1';
    }
    this.drawLine();
  }

}

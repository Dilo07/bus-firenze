import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Coordinate, MapUtils, NptMapComponent } from '@npt/npt-map';
import { Geometry } from '@npt/npt-net';
import moment from 'moment';
import Map from 'ol/Map';
import { Subscription } from 'rxjs';
import { LiveStreamService } from 'src/app/services/live-stream.service';
import { FirenzeMapUtils } from 'src/app/shared/utils/map/Firenze-map.utils';
import { TIMEREFRESH } from '../domain/bus-firenze-constants';
import { FleetManager, RefreshInterface, RefreshOption, VehicleTripPersistence } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-real-time',
  templateUrl: './real-time.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealTimeComponent {
  @ViewChild(NptMapComponent) mapChild: NptMapComponent;

  public fleetManager: FleetManager;
  public complete = true;
  public vehicleTrip: VehicleTripPersistence[] = [];
  public center = [11.206119915108518, 43.81031349352526];
  public stop = true;
  public actualTime = RefreshOption.time5minutes;
  public times: RefreshInterface[] = TIMEREFRESH;
  public layersPopup = [FirenzeMapUtils.LayerEnum.POINT_REAL_TIME];

  private subscription: Subscription[] = [];
  private geometry: Geometry[] = [];
  private interval: any;
  private map: Map;

  constructor(
    private router: Router,
    private liveStreamService: LiveStreamService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  public onMapReady(event: any): void {
    this.map = event;
    this.getGeom();
    this.getTrip();
    this.setMapControls();
  }

  public getTrip(): void {
    this.mapChild.removeLayers([FirenzeMapUtils.LayerEnum.LINE_REAL_TIME, FirenzeMapUtils.LayerEnum.POINT_REAL_TIME]);

    this.subscription.push(this.liveStreamService.getStreamLive(this.fleetManager?.id).subscribe(data => {
      this.vehicleTrip = data;
      this.drawLine();
      this.drawPoint();
    }));

    this.cdr.markForCheck();
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

  public backFromRealTime(): void {
    if (this.fleetManager) {
      this.router.navigate(['../fleet-manager-manage'], { state: { fleetManager: this.fleetManager } });
    }
  }

  private getGeom(): void {
    this.complete = false;
    this.subscription.push(this.liveStreamService.getGeometryLive().subscribe(
      data => {
        this.geometry = data;
        this.drawGeom();
      },
      () => this.complete = true,
      () => { this.getTrip(); this.complete = true; }
    ));
  }

  private drawGeom(): void {
    this.geometry.forEach(geom => {
      geom.coordinates.forEach(cord => {
        const geoJson = this.createGeoJSON({ coordinates: [cord] });
        this.mapChild.viewGeometry(geoJson, FirenzeMapUtils.LayerEnum.CHARGE_POLYGON, FirenzeMapUtils.Style.POLYGON_SELECTOR);
      });
    });
    this.mapChild.zoomToLayer(FirenzeMapUtils.LayerEnum.CHARGE_POLYGON, 12);
  }


  private drawLine(): void {
    this.vehicleTrip.forEach(trip => {
      const style = this.getStyle(trip);
      this.mapChild.drawLine([trip.shape.points], FirenzeMapUtils.LayerEnum.LINE_REAL_TIME, style);
    });
  }

  private getStyle(trip: VehicleTripPersistence): string {
    const now = moment.now();
    const nowPlus15 = moment(now).add(15, 'minutes').valueOf();
    if (!trip.ticketNumber || trip.ticketExpiresAt < now) {
      return FirenzeMapUtils.Style.SECTION_LINKS_ERROR;
    } else if (trip.ticketExpiresAt > now && trip.ticketExpiresAt < nowPlus15) {
      return FirenzeMapUtils.Style.SECTION_LINKS_WARNING;
    } else {
      return FirenzeMapUtils.Style.SECTION_LINKS;
    }
  }

  private drawPoint(): void {
    this.vehicleTrip.forEach(trip => {
      const length = trip.shape.points.coordinates.length;
      // se c'è solo un punto non disegna l'arrowblue
      if (length > 1) {
        const rotation = this.calculateRotation(trip);
        const text = this.generateText(trip);
        this.mapChild.drawPoint([trip.shape.points.coordinates[length - 1].x, trip.shape.points.coordinates[length - 1].y],
          FirenzeMapUtils.LayerEnum.POINT_REAL_TIME, FirenzeMapUtils.Style.ARROW_BLUE(rotation), text, true);
      }
    });
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
    const activeVehicle = new MapUtils.Control.Enum.BUTTON(
      'activeVehicle',
      this.translate.instant('REAL-TIME.ACTIVEVEHICLE'),
      '40px',
      null,
      null,
      true
    );

    const warningVehicle = new MapUtils.Control.Enum.BUTTON(
      'warningVehicle',
      this.translate.instant('REAL-TIME.WARNINGVEHICLE'),
      '80px',
      null,
      null,
      true
    );

    const errorVehicle = new MapUtils.Control.Enum.BUTTON(
      'errorVehicle',
      this.translate.instant('REAL-TIME.ERRORVEHICLE'),
      '120px',
      null,
      null,
      true
    );

    MapUtils.Control.SetControls(this.map, [activeVehicle, warningVehicle, errorVehicle]);
  }

  private createGeoJSON(geom: any): any {
    const geoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [geom.coordinates[0][0].map((coord: Coordinate) => {
              return MapUtils.transform3857([coord[0], coord[1]]);
            })]
          }
        }
      ]
    };
    return geoJSON;
  }

}

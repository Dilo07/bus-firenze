import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Coordinate, MapUtils, NptMapComponent } from '@npt/npt-map';
import { Geometry } from '@npt/npt-net';
import { Subscription } from 'rxjs';
import { LiveStreamService } from 'src/app/services/live-stream.service';
import { FirenzeMapUtils } from 'src/app/shared/utils/map/Firenze-map.utils';
import * as moment from 'moment';
import { FleetManager, VehicleTripPersistence } from '../domain/bus-firenze-domain';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-real-time',
  templateUrl: './real-time.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealTimeComponent implements OnInit {
  @ViewChild(NptMapComponent) mapChild: NptMapComponent;

  public fleetManager: FleetManager;
  public complete = true;

  private subscription: Subscription[] = [];
  private geometry: Geometry[] = [];
  private vehicleTrip: VehicleTripPersistence[] = [];

  constructor(
    private router: Router,
    private liveStreamService: LiveStreamService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void { }

  public backFromRealTime(): void {
    if (this.fleetManager) {
      this.router.navigate(['../fleet-manager'], { state: { fleetManager: this.fleetManager } });
    }
  }

  public onMapReady(event: any): void {
    this.getGeom();
  }

  private getGeom(): void{
    this.complete = false;
    this.subscription.push(this.liveStreamService.getGeometryLive().subscribe(
      data => {
        this.geometry = data;
        this.drawGeom();
      },
      () => this.complete = true,
      () =>  { this.getTrip(); this.complete = true; }
    ));
  }

  private drawGeom(): void {
    this.geometry.forEach(geom => {
      if ( geom.type === 'MultiPolygon'){
        geom.coordinates.forEach(cord => {
          const geoJson = this.createGeoJSON({coordinates: [cord]});
          this.mapChild.viewGeometry(geoJson, FirenzeMapUtils.LayerEnum.CHARGE_POLYGON, FirenzeMapUtils.Style.POLYGON_SELECTOR);
        });
      }else{
        const geoJson = this.createGeoJSON(geom);
        this.mapChild.viewGeometry(geoJson, FirenzeMapUtils.LayerEnum.CHARGE_POLYGON, FirenzeMapUtils.Style.POLYGON_SELECTOR);
      }
    });
    this.mapChild.zoomToLayer(FirenzeMapUtils.LayerEnum.CHARGE_POLYGON, 12);
  }

  public getTrip(): void {
    this.mapChild.removeLayers([FirenzeMapUtils.LayerEnum.LINE_REAL_TIME, FirenzeMapUtils.LayerEnum.POINT_REAL_TIME]);

    this.subscription.push(this.liveStreamService.getStreamLive(this.fleetManager.id).subscribe(data => {
      this.vehicleTrip = data;
      this.drawLine();
      this.drawPoint();
    },
      error => console.log(error)
    ));

    this.cdr.markForCheck();
  }

  private drawLine(): void {
    this.vehicleTrip.forEach(trip => {
      this.mapChild.drawLine([trip.shape.points], FirenzeMapUtils.LayerEnum.LINE_REAL_TIME, FirenzeMapUtils.Style.SECTION_LINKS);
    });
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
    return `<table><tr><th> OBU </th><th> ${this.translate.instant('common.date.start')} </th><th> ${this.translate.instant('common.date.end')} </th></tr>
        <tr><td> ${trip.obuId} </td>
        <td> ${moment(trip.start).format('HH:mm:ss')} </td> <td> ${moment(trip.end).format('HH:mm:ss')} </td>
        </tr></table><hr><br>`;
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

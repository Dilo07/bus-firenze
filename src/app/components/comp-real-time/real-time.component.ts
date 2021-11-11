import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Coordinate, MapUtils, NptMapComponent } from '@npt/npt-map';
import { Geometry } from '@npt/npt-net';
import { Subscription } from 'rxjs';
import { LiveStreamService } from 'src/app/services/live-stream.service';
import { FirenzeMapUtils } from 'src/app/shared/utils/map/Firenze-map.utils';
import { FleetManager } from '../domain/bus-firenze-domain';

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

  constructor(private router: Router, private liveStreamService: LiveStreamService) {
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
      error => { console.log(error);  this.complete = true; },
      () =>  { this.complete = true; } // chiamata le due funziona una volta terminata la subscribe
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

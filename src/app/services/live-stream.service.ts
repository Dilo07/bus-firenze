import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Geometry } from '@npt/npt-net';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VehicleTripPersistence } from '../components/domain/bus-firenze-domain';
import { vehicleTrip } from './mokup/getStreamLive';

@Injectable({
  providedIn: 'root'
})
export class LiveStreamService {

  private apiUrl = this.url + '/api/stream';
  private getVehicleTrip = vehicleTrip;

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  getGeometryLive(): Observable<Geometry[]> {
    return this.http.get<Geometry[]>(this.apiUrl + '/live/inner/geom')
      .pipe(catchError(err => { throw err; }));
    /* return of([]); */
  }

  getStreamLive(fleetManagerId?: number): Observable<VehicleTripPersistence[]> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<VehicleTripPersistence[]>(this.apiUrl + '/live' + url + '/inner')
      .pipe(catchError(err => { throw err; }));
    /* return of(this.getVehicleTrip); */
  }
}

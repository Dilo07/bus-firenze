import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TripStat, VehicleTripPersistence } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/stat';

  getVehicleTrip(id: number, start: string, end?: string, fleetManagerId?: number): Observable<TripStat> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ start, end })
    };
    let url = '';
    if (fleetManagerId) {
      url = '/fleet/' + fleetManagerId;
    }
    return this.http.get<TripStat>(this.apiUrl + url + '/vehicle/' + id + '/trip', options)
      .pipe(catchError(err => { throw err; }));
  }

  getVehicleTripList(id: number, type: string, start: string, end?: string, fleetManagerId?: number): Observable<VehicleTripPersistence[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ start, end, type })
    };
    let url = '';
    if (fleetManagerId) {
      url = '/fleet/' + fleetManagerId;
    }
    return this.http.get<VehicleTripPersistence[]>(this.apiUrl + url + '/vehicle/' + id + '/trip/list', options)
      .pipe(catchError(err => { throw err; }));
  }

  getTripInfoByFleetId(type: string, start: string, end?: string, id?: number): Observable<TripStat> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ start, end, type })
    };
    let url = '';
    if (id) {
      url = '/' + id;
    }
    return this.http.get<TripStat>(this.apiUrl + '/fleet' + url + '/vehicles/trip', options)
      .pipe(catchError(err => { throw err; }));
  }
}

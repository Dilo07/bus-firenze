import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FleetManager, Vehicle } from '../components/domain/bus-firenze-domain';
import { getFleetManager } from './mokup/getFleetmanager';

@Injectable({
  providedIn: 'root'
})
export class FleetManagerService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/fleet';
  private fleetManager = getFleetManager;

  searchFleetManager(keyword: string, valid?: boolean): Observable<FleetManager[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ keyword, valid })
    };
    return this.http.get<FleetManager[]>(this.apiUrl + '/search', options)
      .pipe(catchError(err => { throw err; }));
  }

  getVehiclesById(onlyActive: boolean, fleetManagerId?: number, keyword?: string): Observable<Vehicle[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ keyword })
    };
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<Vehicle[]>(
      this.apiUrl + url + '/vehicles/' + onlyActive, options)
      .pipe(catchError(err => { throw err; }));
  }

  insertFleetManager(fleetManager: FleetManager): Observable<void> {
    return this.http.post<void>(this.apiUrl + '/add', fleetManager)
      .pipe(catchError(err => { throw err; }));
  }

  updateFleetManager(fleetManager: FleetManager): Observable<void> {
    return this.http.put<void>(this.apiUrl + '/update', fleetManager)
      .pipe(catchError(err => { throw err; }));
  }

  deleteFleetManager(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/delete/' + id)
      .pipe(catchError(err => { throw err; }));
  }
}

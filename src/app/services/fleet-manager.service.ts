import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ColumnSort, CompleteFleetManager, FleetManager, Vehicle } from '../components/domain/bus-firenze-domain';
import { getFleetManager } from './mokup/getFleetmanager';

@Injectable({
  providedIn: 'root'
})
export class FleetManagerService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/fleet';
  private fleetManager = getFleetManager;

  getFleetManagerInfo(): Observable<FleetManager> {
    return this.http.get<FleetManager>(this.apiUrl)
      .pipe(catchError(err => { throw err; }));
  }

  searchFleetManager(keyword: string, valid: boolean, offset: number, limit: number, columnOrder: ColumnSort): Observable<FleetManager[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ keyword, offset, limit })
    };
    options.params = options.params.append('sort', columnOrder.active);
    options.params = options.params.append('direction', String(columnOrder.direction));

    return this.http.get<FleetManager[]>(this.apiUrl + '/search/valid/' + valid, options)
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

  getVehicleByObu(obuId: string, fleetManagerId?: number): Observable<Vehicle> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<Vehicle>(this.apiUrl + url + '/vehicle/' + obuId)
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

  validInvalidFleetManager(id: number, valid: boolean): Observable<void> {
    return this.http.put<void>(this.apiUrl + `/${id}/valid/${valid}`, null)
      .pipe(catchError(err => { throw err; }));
  }

  getAppointmentList(hasAppointment: boolean, onlyActive: boolean): Observable<CompleteFleetManager[]> {
    let subpath: string = !hasAppointment ? 'request' : 'list';
    if (hasAppointment) {
      subpath += '/' + onlyActive;
    }
    return this.http.get<CompleteFleetManager[]>(this.apiUrl + '/appointment/' + subpath)
      .pipe(catchError(err => { throw err; }));
  }

  addAppointment(vehicleId: number, appointmentDate: string): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ date: appointmentDate })
    };
    return this.http.post<void>(this.apiUrl + '/appointment/vehicle/' + vehicleId + '/add', null, options)
      .pipe(catchError(err => { throw err; }));
  }

  removeAppointment(vehicleId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/appointment/vehicle/' + vehicleId + '/delete')
      .pipe(catchError(err => { throw err; }));
  }
}

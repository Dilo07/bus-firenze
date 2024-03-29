import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ColumnSort, FleetManager } from '../components/domain/bus-firenze-domain';
import { getFleetManager } from './mokup/getFleetmanager';

@Injectable({
  providedIn: 'root'
})
export class FleetManagerService {

  private apiUrl = this.url + '/api/fleet';
  private fleetManager = getFleetManager;

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  getFleetManagerInfo(): Observable<FleetManager> {
    return this.http.get<FleetManager>(this.apiUrl)
      .pipe(catchError(err => { throw err; }));
  }

  getFleetManagerById(fmId: number): Observable<FleetManager> {
    return this.http.get<FleetManager>(this.apiUrl + `/${fmId}`)
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

  updateFleetManager(fleetManager: FleetManager): Observable<void> {
    return this.http.put<void>(this.apiUrl + '/update', fleetManager)
      .pipe(catchError(err => { throw err; }));
  }

  deleteFleetManager(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/delete/' + id)
      .pipe(catchError(err => { throw err; }));
  }

  validInvalidFleetManager(id: number, valid: boolean, contractCode: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ contractCode })
    };
    return this.http.put<void>(this.apiUrl + `/${id}/valid/${valid}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  getFleetDocument(fleetManagerId: number, fileId: number): Observable<HttpResponse<Blob> | Blob> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + '/' + fleetManagerId + '/upload/' + fileId, options)
      .pipe(catchError(err => { throw err; }));
  }

  validDocumentFleet(fleetManagerId: number, fileId: number): Observable<void> {
    return this.http.put<void>(this.apiUrl + `/${fleetManagerId}/document/${fileId}`, null)
      .pipe(catchError(err => { throw err; }));
  }

  getFleetDeposit(depositWarning: boolean): Observable<FleetManager[]> {
    let path = '';
    if (depositWarning) { path = '/warning'; }
    /* return of(this.fleetManager); */
    return this.http.get<FleetManager[]>(this.apiUrl + '/deposit' + path)
      .pipe(catchError(err => { throw err; }));
  }
}

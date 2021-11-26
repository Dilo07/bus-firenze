import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Driver } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/fleet';

  getDrivers(keyword: string, fleetManagerId?: number): Observable<Driver[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ keyword })
    };
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<Driver[]>(this.apiUrl + url + '/drivers', options)
      .pipe(catchError(err => { throw err; }));
  }

  addDriver(driver: Driver, fleetManagerId?: number): Observable<void> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.post<void>(this.apiUrl + url + '/driver/add', driver)
      .pipe(catchError(err => { throw err; }));
  }
}

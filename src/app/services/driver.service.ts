import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Driver, DriverVehicle } from '../components/domain/bus-firenze-domain';
import { driversByVehicle, vehiclesByDriver } from './mokup/getDriverVehicle';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/fleet';

  private driversByVehicle = driversByVehicle;
  private vehiclesByDriver = vehiclesByDriver;

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

  editDriver(driver: Driver, driverId?: number, fleetManagerId?: number): Observable<void> {
    let urlFleet = '';
    let urlDriver = '';
    if (fleetManagerId) {
      urlFleet = '/' + fleetManagerId;
    }
    if (driverId) {
      urlDriver = '/' + driverId;
    }
    return this.http.put<void>(this.apiUrl + urlFleet + '/driver' + urlDriver + '/update', driver)
      .pipe(catchError(err => { throw err; }));
  }

  deleteDriver(driverId: number, fleetManagerId?: number): Observable<void>{
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.delete<void>(this.apiUrl + url + '/driver/delete/' + driverId)
      .pipe(catchError(err => { throw err; }));
  }

  getVehiclesByDriver(driverId?: number, fleetManagerId?: number): Observable<DriverVehicle[]>{
    let urlFleet = '';
    let urlDriver = '';
    if (fleetManagerId) {
      urlFleet = '/' + fleetManagerId;
    }
    if (driverId) {
      urlDriver = '/' + driverId;
    }
    /* return this.http.get<DriverVehicle[]>(this.apiUrl + urlFleet + '/driver' + urlDriver + '/vehicles')
      .pipe(catchError(err => { throw err; })); */
    return of(this.vehiclesByDriver);
  }

  getDriversByVehicle(vehicleId?: number, fleetManagerId?: number): Observable<DriverVehicle[]>{
    let urlFleet = '';
    let urlVehicle = '';
    if (fleetManagerId) {
      urlFleet = '/' + fleetManagerId;
    }
    if (vehicleId) {
      urlVehicle = '/' + vehicleId;
    }
    /* return this.http.get<DriverVehicle[]>(this.apiUrl + urlFleet + '/vehicle' + urlVehicle + '/drivers')
      .pipe(catchError(err => { throw err; })); */
    return of(this.driversByVehicle);
  }
}

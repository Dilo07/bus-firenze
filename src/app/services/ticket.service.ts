import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ticket, VehicleWithoutTicket } from '../components/domain/bus-firenze-domain';
import { activeTicket } from './mokup/getTicket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = this.url + '/api/vehicle';
  private activeVehicle = activeTicket;

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }


  getVehicleNoTicket(isDriver: boolean, fleetManagerId?: number): Observable<VehicleWithoutTicket[]> {
    let url = '';
    if (isDriver) {
      url = '/' + 'driver';
    }
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<VehicleWithoutTicket[]>(this.apiUrl + url + '/ticket/vehicles/')
      .pipe(catchError(err => { throw err; }));
  }

  getActiveTicket(isDriver: boolean, fleetManagerId: number, start?: string, end?: string): Observable<Ticket[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ start, end })
    };
    let url = '';
    if (isDriver) {
      url = '/' + 'driver';
    }
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<Ticket[]>(this.apiUrl + url + '/tickets', options)
      .pipe(catchError(err => { throw err; }));
  }

  checkTicket(vehicleId: number, ticketId: string): Observable<Ticket> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ ticketId })
    };
    return this.http.get<Ticket>(this.apiUrl + '/vehicle/' + vehicleId + '/ticket', options)
      .pipe(catchError(err => { throw err; }));
  }

  addTicket(
    isDriver: boolean,
    vehicleId: number,
    ticketId: string,
    delayed: boolean,
    extend: boolean,
    fleetManagerId?: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ ticketId, delayed, extend })
    };
    let url = '';
    if (isDriver) {
      url = '/' + 'driver';
    }
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.put<void>(this.apiUrl + url + '/vehicle/' + vehicleId + '/ticket', null, options)
      .pipe(catchError(err => { throw err; }));
  }

  removeTicket(ticketId: string, vehicleId: number, isDriver: boolean, fleetManagerId: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ ticketId })
    };
    let url = '';
    if (isDriver) {
      url = '/' + 'driver';
    }
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.delete<void>(this.apiUrl + url + '/vehicle/' + vehicleId + '/ticket', options)
      .pipe(catchError(err => { throw err; }));
  }
}

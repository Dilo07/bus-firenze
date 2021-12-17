import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ticket } from '../components/domain/bus-firenze-domain';
import { ActiveTicket } from './mokup/getTicket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/fleet';
  private activeVehicle = ActiveTicket;

  getVehicleNoTicket(isDriver: boolean, fleetManagerId?: number): Observable<Ticket[]> {
    let url = '';
    if (isDriver) {
      url = '/' + 'driver';
    }
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<Ticket[]>(this.apiUrl + url + '/ticket/vehicles/')
      .pipe(catchError(err => { throw err; }));
  }

  getActiveTicket(): Observable<Ticket[]> {

    return of(this.activeVehicle);
  }

  checkTicket(vehicleId: number, ticketNumber: string): Observable<void> {
    return this.http.get<void>(this.apiUrl + '/vehicle/' + vehicleId + '/ticket/' + ticketNumber)
      .pipe(catchError(err => { throw err; }));
  }

  addTicket(isDriver: boolean, vehicleId: number, ticketNumber: string, fleetManagerId?: number): Observable<void> {
    let url = '';
    if (isDriver) {
      url = '/' + 'driver';
    }
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.put<void>(this.apiUrl + url + '/vehicle/' + vehicleId + '/ticket/' + ticketNumber, null)
      .pipe(catchError(err => { throw err; }));
  }
}

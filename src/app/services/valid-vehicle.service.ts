import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { FleetManager } from '../components/domain/bus-firenze-domain';
import { getFleetManager } from './mokup/getFleetmanager';

@Injectable({
  providedIn: 'root'
})
export class ValidVehicleService {
  private apiUrl = this.url + '/api/fleet';
  private fleetMokup = getFleetManager;

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  getFleetDeposit(): Observable<FleetManager[]> {
    /* return of(this.fleetMokup); */
    return this.http.get<FleetManager[]>(this.apiUrl + '/deposit')
      .pipe(catchError(err => { throw err; }));
  }

  validVehicle(fleetManagerId: number, vehicleId: number, type: string, valid: boolean): Observable<void> {
    return this.http.put<void>(this.apiUrl + `/${fleetManagerId}/vehicle/${vehicleId}/${type}/valid/${valid}`, null)
      .pipe(catchError(err => { throw err; }));
  }
}

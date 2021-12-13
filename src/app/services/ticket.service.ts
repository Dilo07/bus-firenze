import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DisplayName } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/fleet';

  getVehicleNoTicket(isDriver: boolean): Observable<DisplayName[]> {
    let url = '';
    if (isDriver) {
      url = '/' + 'driver';
    }
    return this.http.get<DisplayName[]>(this.apiUrl + url + '/vehicles/ticket/')
      .pipe(catchError(err => { throw err; }));
  }
}

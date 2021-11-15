import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vehicle } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/fleet';

  addVehicle(vehicle: Vehicle): Observable<void> {
    return this.http.post<void>(this.apiUrl + '/vehicle/add', vehicle)
      .pipe(catchError(err => { throw err; }));
  }

  updateVehicle(vehicle: Vehicle): Observable<void> {
    return this.http.put<void>(this.apiUrl + '/vehicle/update', vehicle)
      .pipe(catchError(err => { throw err; }));
  }
}

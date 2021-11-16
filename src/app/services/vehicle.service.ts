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

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/vehicle/delete/' + id)
      .pipe(catchError(err => { throw err; }));
  }

  getVehicles(isAssociated: boolean, keywords?: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>
      (this.apiUrl + '/vehicles/search?isAssociated=' + isAssociated + (keywords ? '&keyword=' + keywords : ''))
      .pipe(catchError(err => { throw err; }));
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vehicle } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/fleet';

  addVehicle(vehicle: Vehicle, fleetManagerId?: number): Observable<void> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.post<void>(this.apiUrl + url + '/vehicle/add', vehicle)
      .pipe(catchError(err => { throw err; }));
  }

  updateVehicle(vehicle: Vehicle, fleetManagerId?: number): Observable<void> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.put<void>(this.apiUrl + url + '/vehicle/update', vehicle)
      .pipe(catchError(err => { throw err; }));
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/vehicle/delete/' + id)
      .pipe(catchError(err => { throw err; }));
  }

  getVehicles(isAssociated: boolean, keyword?: string): Observable<Vehicle[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ isAssociated, keyword })
    };
    return this.http.get<Vehicle[]>(this.apiUrl + '/vehicles/search', options)
      .pipe(catchError(err => { throw err; }));
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FleetManager, Vehicle } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class FleetManagerService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/fleet';

  searchFleetManager(keywords: string): Observable<FleetManager[]>{
    return this.http.get<FleetManager[]>(this.apiUrl + '/search/?keyword=' + keywords)
            .pipe(catchError(err => { throw err; }));
  }

  getVehiclesById(fleetManagerId: number, onlyActive: boolean, keywords?: string): Observable<Vehicle[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ keywords })
  };
    return this.http.get<Vehicle[]>(
      this.apiUrl + '/' + fleetManagerId + '/vehicles/' + onlyActive, options)
      .pipe(catchError(err => { throw err; }));
  }
}

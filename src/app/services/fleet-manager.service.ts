import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FleetManager } from '../components/domain/bus-firenze-domain';
import { getFleetManager } from './mokup/getFleetmanager';

@Injectable({
  providedIn: 'root'
})
export class FleetManagerService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private mokupFleet = getFleetManager;
  private apiUrl = this.url + '/api/fleet';

  searchFleetManager(keywords?: string): Observable<FleetManager[]>{
    return this.http.get<FleetManager[]>(this.apiUrl + '/search/?keyword=' + keywords)
            .pipe(catchError(err => { throw err; }));
    /* return of(this.mokupFleet); */
  }
}

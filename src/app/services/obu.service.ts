import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vehicle } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class ObuService {

  constructor(
    private http: HttpClient,
    @Inject('beUrl') private url: string
  ) { }

  private apiUrl = this.url + '/api/fleet/obu';

  testObu(id: string, plate: string, nat: string): Observable<void> {
    return this.http.get<void>(this.apiUrl + '/' + id + '/plate/' + plate + '/nat/' + nat + '/test')
      .pipe(catchError(err => { throw err; }));
  }

  addObu(id: string, vehicle: number): Observable<void> {
    return this.http.put<void>(this.apiUrl + '/' + id + '/vehicle/' + vehicle, '')
      .pipe(catchError(err => { throw err; }));
  }

  updateObu(id: string, vehicle: number, newId: string): Observable<void> {
    return this.http.put<void>(this.apiUrl + '/' + id + '/vehicle/' + vehicle + '/change/' + newId, '')
      .pipe(catchError(err => { throw err; }));
  }

  deleteObu(vehicle: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/delete/vehicle/' + vehicle)
      .pipe(catchError(err => { throw err; }));
  }

  changePlate(id: string, vehicle: number, plate: string, nat: string): Observable<Vehicle> {
    return this.http.put<Vehicle>(this.apiUrl + '/' + id + '/vehicle/' + vehicle + '/plate/' + plate + '/nat/' + nat, '')
      .pipe(catchError(err => { throw err; }));
  }

  uploadObuDocument(obuId: number, vehicleId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl + '/obu/' + obuId + '/vehicle/' + vehicleId + '/upload', formData)
      .pipe(catchError(err => { throw err; }));
  }
}

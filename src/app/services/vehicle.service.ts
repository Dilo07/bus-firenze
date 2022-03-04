import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

  addVehicle(deposit: File, certificate: File, vehicle: Vehicle, fleetManagerId?: number): Observable<void> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    const formData = new FormData();
    formData.append('deposit', deposit);
    formData.append('file', certificate);
    formData.append('metadata', JSON.stringify(vehicle));
    return this.http.post<void>(this.apiUrl + url + '/vehicle/add', formData)
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

  deleteVehicle(id: number, fleetManagerId?: number): Observable<void> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.delete<void>(this.apiUrl + url + '/vehicle/delete/' + id)
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

  getVehiclesById(onlyActive: boolean, fleetManagerId?: number, keyword?: string): Observable<Vehicle[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ keyword })
    };
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<Vehicle[]>(
      this.apiUrl + url + '/vehicles/' + onlyActive, options)
      .pipe(catchError(err => { throw err; }));
  }

  getVehicleByObu(obuId: string, fleetManagerId?: number): Observable<Vehicle> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<Vehicle>(this.apiUrl + url + '/vehicle/' + obuId)
      .pipe(catchError(err => { throw err; }));
  }

  getVehiclesIstalled(upload: boolean, keyword?: string): Observable<Vehicle[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ keyword, upload })
    };
    return this.http.get<Vehicle[]>(this.apiUrl + '/vehicles/installed', options)
      .pipe(catchError(err => { throw err; }));
  }

  updateStatusVehicle(vehicleId: number): Observable<void> {
    return this.http.put<void>(this.apiUrl + '/vehicle/' + vehicleId + '/check', null)
      .pipe(catchError(err => { throw err; }));
  }

  getManual(device: number, type: string): Observable<HttpResponse<Blob> | Blob> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + '/manual/' + device + '/' + type, options)
      .pipe(catchError(err => { throw err; }));
  }

  getCertificateFile(vehicleId: number, certificateId: number): Observable<any> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + '/vehicle/' + vehicleId + '/certificate/' + certificateId, options)
      .pipe(catchError(err => { throw err; }));
  }

  uploadCertificate(vehicleId: number, file: File, fleetManagerId?: number): Observable<void> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(this.apiUrl + `${url}/vehicle/${vehicleId}/certificate/update`, formData)
      .pipe(catchError(err => { throw err; }));
  }
}

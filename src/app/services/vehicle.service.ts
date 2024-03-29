import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DepositType, Vehicle, VehicleWarning } from '../components/domain/bus-firenze-domain';
import { vehicleDetails002, vehicleDetails209 } from './mokup/getStreamLive';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = this.url + '/api/vehicle';
  private vehicleDetails002 = vehicleDetails002;
  private vehicleDetails209 = vehicleDetails209;

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

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

  deleteVehicle(id: number, reqDeposit: File, fleetManagerId?: number): Observable<void> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    const formData = new FormData();
    formData.append('reqDeposit', reqDeposit);
    return this.http.post<void>(this.apiUrl + url + '/vehicle/delete/' + id, formData)
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
    return this.http.get<Vehicle[]>(this.apiUrl + url + '/vehicles/' + onlyActive, options)
      .pipe(catchError(err => { throw err; }));
  }

  getVehicleById(fleetManagerId: number, vehicleId: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(this.apiUrl + `/${fleetManagerId}/singleVehicle/${vehicleId}`)
      .pipe(catchError(err => { throw err; }));
  }

  getVehicleDeposit(all: boolean, fleetManagerId: number, keyword?: string, toVerify?: boolean): Observable<Vehicle[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ keyword, toVerify })
    };
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    return this.http.get<Vehicle[]>(this.apiUrl + url + `/deposit/vehicles/${all}`, options)
      .pipe(catchError(err => { throw err; }));
  }

  getVehicleWarning(fleetManagerId: number, keyword?: string): Observable<VehicleWarning[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ keyword })
    };
    return this.http.get<VehicleWarning[]>(this.apiUrl + `/${fleetManagerId}/deposit/vehicles/warning`, options)
      .pipe(catchError(err => { throw err; }));
  }

  sendAdviceToWarningVehicle(vehicleId: string): Observable<void> {
    return this.http.get<void>(this.apiUrl + `/${vehicleId}/deposit/vehicles/sendWarningMail`)
      .pipe(catchError(err => { throw err; }));
  }

  getVehicleByObu(obuId: string, fleetManagerId?: number): Observable<Vehicle> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    /* if (obuId === '000490000086209') {
      return of(vehicleDetails209);
    } else {
      return of(vehicleDetails002);
    } */
    return this.http.get<Vehicle>(this.apiUrl + url + '/vehicle/' + obuId)
      .pipe(catchError(err => { throw err; }));
  }

  updateStatusVehicle(vehicleId: number): Observable<void> {
    return this.http.put<void>(this.apiUrl + '/vehicle/' + vehicleId + '/check', null)
      .pipe(catchError(err => { throw err; }));
  }

  getCertificateFile(vehicleId: number, certificateId: number): Observable<HttpResponse<Blob> | Blob> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + '/vehicle/' + vehicleId + '/certificate/' + certificateId, options)
      .pipe(catchError(err => { throw err; }));
  }

  getDeposit(vehicleId: number, type: DepositType, documentId: number): Observable<HttpResponse<Blob> | Blob> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + `/vehicle/${vehicleId}/${type}/${documentId}`, options)
      .pipe(catchError(err => { throw err; }));
  }

  uploadCertificate(vehicleId: number, file: File, fleetManagerId: number): Observable<void> {
    const url = '/' + fleetManagerId;
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(this.apiUrl + `${url}/vehicle/${vehicleId}/certificate/update`, formData)
      .pipe(catchError(err => { throw err; }));
  }

  uploadDeposit(vehicleId: number, type: DepositType, file: File, fleetManagerId?: number): Observable<void> {
    let url = '';
    if (fleetManagerId) {
      url = '/' + fleetManagerId;
    }
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<void>(this.apiUrl + `${url}/vehicle/${vehicleId}/${type}/add`, formData)
      .pipe(catchError(err => { throw err; }));
  }

  validVehicle(fleetManagerId: number, vehicleId: number, type: string, valid: boolean): Observable<void> {
    return this.http.put<void>(this.apiUrl + `/${fleetManagerId}/vehicle/${vehicleId}/${type}/valid/${valid}`, null)
      .pipe(catchError(err => { throw err; }));
  }
}

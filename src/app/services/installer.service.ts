import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DepositType } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class InstallerService {

  private apiUrl = this.url + '/api/installer';

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  getManual(device: number, type: string): Observable<HttpResponse<Blob> | Blob> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + '/manual/' + device + '/' + type, options)
      .pipe(catchError(err => { throw err; }));
  }

  getDocObu(vehicleId: number, obu: string, type: DepositType, documentId: number): Observable<HttpResponse<Blob> | Blob> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + `/vehicle/${vehicleId}/obu/${obu}/${type}/${documentId}`, options)
      .pipe(catchError(err => { throw err; }));
  }
}

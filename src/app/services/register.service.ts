import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FleetManager } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/noauth';

  getOtpCode(contact: string, lang: string): Observable<string> {
    return this.http.post<string>(this.apiUrl + '/register/code/' + lang, contact)
      .pipe(catchError(err => { throw err; }));
  }

  registerFleet(file: File, fleetManager: FleetManager): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(fleetManager));
    return this.http.post<void>(this.apiUrl + '/register', formData)
      .pipe(catchError(err => { throw err; }));
  }

  getTemplateDocument(): Observable<any> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + '/register/template', options)
      .pipe(catchError(err => { throw err; }));
  }

  checkVatNumber(nation: string, vat: string): Observable<any> {
    return this.http.get(this.apiUrl + `/checkVat/${nation}/${vat}`)
      .pipe(catchError(err => { throw err; }));
  }
}

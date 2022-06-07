import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FleetManager, VatValidation } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = this.url + '/noauth';

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  getOtpCode(contact: string, lang: string): Observable<string> {
    return this.http.post<string>(this.apiUrl + '/register/code/' + lang, contact)
      .pipe(catchError(err => { throw err; }));
  }

  registerFleet(fileModule: File, fileIdentityCard: File, fileCommerceReg: File, fleetManager: FleetManager): Observable<void> {
    const formData = new FormData();
    formData.append('reqForm', fileModule);
    formData.append('idDoc', fileIdentityCard);
    formData.append('comReg', fileCommerceReg);
    formData.append('metadata', JSON.stringify(fleetManager));
    return this.http.post<void>(this.apiUrl + '/register', formData)
      .pipe(catchError(err => { throw err; }));
  }

  getTemplateDocument(): Observable<HttpResponse<Blob> | Blob> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + '/register/template', options)
      .pipe(catchError(err => { throw err; }));
  }

  checkVatNumber(nation: string, vat: string): Observable<VatValidation> {
    return this.http.get<VatValidation>(this.apiUrl + `/checkVat/${nation}/${vat}`)
      .pipe(catchError(err => { throw err; }));
  }
}

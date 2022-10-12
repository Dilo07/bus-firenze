import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FleetManager, VatValidation } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class NoAuthRegisterService {
  private apiUrl = this.url;

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  getOtpCode(contact: string, lang: string, captchaToken?: string): Observable<string> {
    const registerUrl = captchaToken ? '/noauth' : '/api/register';
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ captchaToken })
    };
    return this.http.post<string>(this.apiUrl + registerUrl + '/register/code/' + lang, contact, options)
      .pipe(catchError(err => { throw err; }));
  }

  registerFleet(
    fileModule: File,
    fileIdentityCard: File,
    fileCommerceReg: File,
    fleetManager: FleetManager,
    captchaToken?: string): Observable<void> {

    const registerUrl = captchaToken ? '/noauth' : '/api/register';
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ captchaToken })
    };
    const formData = new FormData();
    formData.append('reqForm', fileModule);
    formData.append('idDoc', fileIdentityCard);
    formData.append('comReg', fileCommerceReg);
    formData.append('metadata', JSON.stringify(fleetManager));
    return this.http.post<void>(this.apiUrl + registerUrl + '/register', formData, options)
      .pipe(catchError(err => { throw err; }));
  }

  getTemplateDocument(captchaToken?: string): Observable<HttpResponse<Blob> | Blob> {
    const registerUrl = captchaToken ? '/noauth' : '/api/register';
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ captchaToken })
    };
    return this.http.get(this.apiUrl + registerUrl + '/register/template', options)
      .pipe(catchError(err => { throw err; }));
  }

  checkVatNumber(nation: string, vat: string, captchaToken?: string): Observable<VatValidation> {
    const registerUrl = captchaToken ? '/noauth' : '/api/register';
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ captchaToken })
    };
    return this.http.get<VatValidation>(this.apiUrl + registerUrl + `/checkVat/${nation}/${vat}`, options)
      .pipe(catchError(err => { throw err; }));
  }
}

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils, RecaptchaTokenService } from '@npt/npt-template';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FleetManager, VatValidation } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class NoAuthRegisterService {
  private apiUrl = this.url;

  constructor(
    private http: HttpClient,
    private recaptchaTokenService: RecaptchaTokenService,
    @Inject('beUrl') private url: string) { }

  async getOtpCode(contact: string, lang: string, isCaptchaToken: boolean): Promise<Observable<string>> {
    const registerUrl = isCaptchaToken ? '/noauth' : '/api/register';
    let captchaToken = null;
    if (isCaptchaToken) {
      await this.recaptchaTokenService.getToken('register').then((token) => captchaToken = token);
    }
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ captchaToken })
    };
    return this.http.post<string>(this.apiUrl + registerUrl + '/register/code/' + lang, contact, options)
      .pipe(catchError(err => { throw err; }));
  }

  async registerFleet(
    fileModule: File,
    fileIdentityCard: File,
    fileCommerceReg: File,
    fleetManager: FleetManager,
    isCaptchaToken: boolean): Promise<Observable<void>> {

    const registerUrl = isCaptchaToken ? '/noauth' : '/api/register';
    let captchaToken = null;
    if (isCaptchaToken) {
      await this.recaptchaTokenService.getToken('register').then((token) => captchaToken = token);
    }
    const options = {
      // headers: new HttpHeaders().set('Content-Type', 'application/json'),
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

  async getTemplateDocument(isCaptchaToken: boolean): Promise<Observable<HttpResponse<Blob> | Blob>> {
    const registerUrl = isCaptchaToken ? '/noauth' : '/api/register';
    let captchaToken = null;
    if (isCaptchaToken) {
      await this.recaptchaTokenService.getToken('register').then((token) => captchaToken = token);
    }
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ captchaToken })
    };
    return this.http.get(this.apiUrl + registerUrl + '/register/template', options)
      .pipe(catchError(err => { throw err; }));
  }

  async checkVatNumber(nation: string, vat: string, isCaptchaToken: boolean): Promise<Observable<VatValidation>> {
    const registerUrl = isCaptchaToken ? '/noauth' : '/api/register';
    let captchaToken = null;
    if (isCaptchaToken) {
      await this.recaptchaTokenService.getToken('register').then((token) => captchaToken = token);
    }
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ captchaToken })
    };
    return this.http.get<VatValidation>(this.apiUrl + registerUrl + `/checkVat/${nation}/${vat}`, options)
      .pipe(catchError(err => { throw err; }));
  }
}

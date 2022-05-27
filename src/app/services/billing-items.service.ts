import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from '@npt/npt-template';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BillingItems, BillingItemsAgg } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class BillingItemsService {
  private apiUrl = this.url + '/api/billing';

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  /* getBillingItems(start: string, end: string, billingStatus: string, fmId?: number): Observable<BillingItems[]> {
    let url = '';
    if (fmId) {
      url = '/' + fmId;
    }
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ start, end, status: billingStatus })
    };

    return this.http.get<BillingItems[]>(this.apiUrl + '/all' + url, options)
      .pipe(catchError(err => { throw err; }));
  } */

  getBillingItemsAggregate(start: string, end: string, billingStatus: string, fmId?: number): Observable<BillingItemsAgg[]> {
    let url = '';
    if (fmId) {
      url = '/' + fmId;
    }
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ start, end, status: billingStatus })
    };
    return this.http.get<BillingItemsAgg[]>(this.apiUrl + '/gopId/all' + url, options)
      .pipe(catchError(err => { throw err; }));
  }

  getPenaltiesByFmId(start: string, end: string, billingStatus: string, fmId: number): Observable<BillingItems[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ start, end, status: billingStatus })
    };

    return this.http.get<BillingItems[]>(this.apiUrl + `/penalties/${fmId}`, options)
      .pipe(catchError(err => { throw err; }));
  }

  addPenal(billingType: number, fmId: number, vehicleId: number, date: string): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ date })
    };
    return this.http.post<void>(this.apiUrl + `/penalties/${billingType}/fleet/${fmId}/vehicle/${vehicleId}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  getPenalType(manual: boolean): Observable<number[]> {
    return this.http.get<number[]>(this.apiUrl + `/type/${manual}`)
      .pipe(catchError(err => { throw err; }));
  }
}

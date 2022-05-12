import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BillingItems } from '../components/domain/bus-firenze-domain';

@Injectable({
  providedIn: 'root'
})
export class BillingItemsService {
  private apiUrl = this.url + '/api/billing';

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  getBillingItems(fmId?: number): Observable<BillingItems> {
    let url = '';
    if (fmId) {
      url = '/' + fmId;
    }

    return this.http.get<BillingItems>(this.apiUrl + '/all' + url)
      .pipe(catchError(err => { throw err; }));
  }
}

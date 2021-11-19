import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObuService {

  constructor(
    private http: HttpClient,
    @Inject('beUrl') private url: string
  ) { }

  private apiUrl = this.url + '/api/fleet/obu';

  testObu(id: string): Observable<void> {
    return this.http.get<void>(this.apiUrl + '/' + id + '/test')
      .pipe(catchError(err => { throw err; }));
  }
}

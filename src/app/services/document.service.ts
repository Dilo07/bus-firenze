import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/download';

  getDocument(path: string): Observable<HttpResponse<Blob> | Blob> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'blob'
    };
    return this.http.get(this.apiUrl + `/${path}`, options)
      .pipe(catchError(err => { throw err; }));
  }
}

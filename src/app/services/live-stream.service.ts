import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Geometry } from '@npt/npt-net';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LiveStreamService {

  constructor(private http: HttpClient, @Inject('beUrl') private url: string) { }

  private apiUrl = this.url + '/api/stream';

  getGeometryLive(): Observable<Geometry[]> {
    return this.http.get<Geometry[]>(this.apiUrl + '/live/inner/geom')
      .pipe(catchError(err => { throw err; }));
  }
}

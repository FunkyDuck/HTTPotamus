import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private responseSubject = new BehaviorSubject<any>(null);
  response$ = this.responseSubject.asObservable();

  private requestSubject = new BehaviorSubject<any>(null);
  request$ = this.requestSubject.asObservable();
  
  constructor(private _http: HttpClient) { }

  sendRequest(url: string, method: string, body: any = null): Observable<any> {
    const start = performance.now();

    return this._http.request(method, url, {
      body,
      observe: 'response'
    }).pipe(
      map((res: HttpResponse<any>) => {
        const end = performance.now();
        const duration = Math.round(end - start);
        const bodySize = new TextEncoder().encode(JSON.stringify(res.body) || '').length;
        const headersKey = res.headers.keys();
        let headersSize = 0;
        headersKey.forEach(key => {
          const val = res.headers.get(key) || '';
          headersSize += new TextEncoder().encode(`${key}: ${val}\r\n`).length;
        });


        
        return {
          status: res.status,
          statusText: res.statusText,
          duration: duration,
          body: res.body,
          headers: res.headers,
          bodySize: (bodySize / 1024),
          headersSize: (headersSize / 1024)
        };
      }),
      catchError((err: HttpErrorResponse) => {
        const end = performance.now();
        const duration = Math.round(end - start);
        
        return of({
          status: err.status,
          statusText: err.statusText,
          duration: duration,
          body: err.error,
          error: true
        });
      })
    );
  }

  updateResponse(data: any): void {
    console.info(`Update : `, data)
    this.responseSubject.next(data);
  }

  setRequest(req: any): void {
    this.requestSubject.next(req);
  }
}

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
        
        return {
          status: res.status,
          statusText: res.statusText,
          duration: duration,
          body: res.body
        };
      }),
      catchError((err: HttpErrorResponse) => {
        const end = performance.now();
        const duration = Math.round(end - start);
        console.error(`STATUS ERR :: ${err.status}`)
        
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
    this.responseSubject.next(data);
  }
}

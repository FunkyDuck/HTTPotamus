import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private responseSubject = new BehaviorSubject<any>(null);
  response$ = this.responseSubject.asObservable();
  
  constructor(private _http: HttpClient) { }

  getRequest(url: string): Observable<any> {
    return this._http.get(url).pipe(
      catchError(err => {
        console.error(`Request error : ${err}`);
        return of({error: err});
      }) 
    );
  }

  updateResponse(data: any): void {
    this.responseSubject.next(data);
  }
}

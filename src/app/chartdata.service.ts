import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChartdataService {

  private apiUrl = 'https://localhost:7071/api/MutualFund/GetMonthWiseData';
  constructor(private http: HttpClient) { }

  getMonthWiseData(
    schemeId: number,
    columnName: string,
    startMonth: string,
    endMonth: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('schemeId', schemeId)
      .set('columnName', columnName)
      .set('startMonth', startMonth)
      .set('endMonth', endMonth);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}

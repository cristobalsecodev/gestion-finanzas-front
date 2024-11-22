import { Injectable } from '@angular/core';
import { IncomeOrExpense } from '../../interfaces.ts/IncomeOrExpense';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IncomeOrExpenseService {

  private incomeOrExpenseUrl = 'http://localhost:8080/income-or-expense'


  constructor(private http: HttpClient) { }

  saveIncomeOrExpense(incomeOrExpense: IncomeOrExpense): Observable<number> {

    return this.http.post<number>(`${this.incomeOrExpenseUrl}/save`, incomeOrExpense)

  }

  getIncomeOrExpense(id: number): Observable<IncomeOrExpense> {

    return this.http.get<IncomeOrExpense>(`${this.incomeOrExpenseUrl}/${id}`)

  }

  getFilteredIncomeOrExpenses(
    filter: any,
    page: number = 0,
    size: number = 0,
    sortBy: string = 'date',
    sortDir: string = 'asc'
  ): Observable<IncomeOrExpense[]> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir)

    // for(const key in filter) {

    //   if(filter[key] !== null && filter[key] !== undefined) {

    //     params = params.set(key, filter[key])

    //   }

    // }

    return this.http.get<IncomeOrExpense[]>(`${this.incomeOrExpenseUrl}/filter`, { params })

  }

}

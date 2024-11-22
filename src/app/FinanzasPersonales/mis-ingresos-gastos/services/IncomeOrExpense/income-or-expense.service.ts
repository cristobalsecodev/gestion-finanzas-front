import { Injectable } from '@angular/core';
import { IncomeOrExpense } from '../../interfaces.ts/IncomeOrExpense.interface';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FilterIncomeOrExpense } from '../../interfaces.ts/FilterIncomeOrExpense.interface';

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

  getFilteredIncomeOrExpenses(filter: FilterIncomeOrExpense): Observable<IncomeOrExpense[]> {

    return this.http.post<any>(`${this.incomeOrExpenseUrl}/filter`, filter)
      .pipe(
        map(response => response._embedded.incomeOrExpenseList)
      )

  }

}

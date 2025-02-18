import { Injectable } from '@angular/core';
import { IncomeOrExpense } from '../../interfaces/IncomeOrExpense.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterIncomeOrExpense } from '../../interfaces/FilterIncomeOrExpense.interface';
import { PaginationData } from 'src/app/shared/interfaces/PaginationData.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomeOrExpenseService {

  private incomeOrExpenseUrl = `${environment.apiUrl}/income-or-expense`


  constructor(private http: HttpClient) { }

  saveIncomeOrExpense(incomeOrExpense: IncomeOrExpense): Observable<number> {

    return this.http.post<number>(`${this.incomeOrExpenseUrl}/save`, incomeOrExpense)

  }

  getIncomeOrExpense(id: number): Observable<IncomeOrExpense> {

    return this.http.get<IncomeOrExpense>(`${this.incomeOrExpenseUrl}/${id}`)

  }

  deleteIncomeOrExpense(id: number): Observable<string> {

    return this.http.delete<any>(`${this.incomeOrExpenseUrl}/delete/${id}`)
      .pipe(
        map(response => response.message)
      )

  }

  getFilteredIncomeOrExpenses(filter: FilterIncomeOrExpense): Observable<PaginationData> {

    return this.http.post<any>(`${this.incomeOrExpenseUrl}/filter`, filter)
  }

}

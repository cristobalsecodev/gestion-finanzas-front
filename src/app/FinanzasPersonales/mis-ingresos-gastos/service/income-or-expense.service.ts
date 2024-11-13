import { Injectable } from '@angular/core';
import { IncomeOrExpense } from '../interfaces.ts/IncomeOrExpense';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IncomeOrExpenseService {

  private incomeOrExpenseUrl = 'http://localhost:8080/income-or-expense'

  constructor(private http: HttpClient) { }

  saveIncomOrExpense(incomeOrExpense: IncomeOrExpense): Observable<number> {

    return this.http.post<number>(`${this.incomeOrExpenseUrl}/save`, incomeOrExpense)

  }
}

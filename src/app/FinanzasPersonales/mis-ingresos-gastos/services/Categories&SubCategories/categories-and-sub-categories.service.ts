import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseCategory, Categories, SubCategories } from '../../interfaces.ts/IncomeOrExpense.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesAndSubCategoriesService {

  private categoriesUrl = 'http://localhost:8080/income-or-expense-categories'
  private subCategoriesUrl = 'http://localhost:8080/income-or-expense-subcategories'

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Categories[]> {

    return this.http.get<Categories[]>(`${this.categoriesUrl}/get-by-user`)

  }

  getSubCategories(): Observable<SubCategories[]> {

    return this.http.get<SubCategories[]>(`${this.subCategoriesUrl}/get-by-user`)

  }

  display(element: BaseCategory): string {
    return element ? element.name : ''
  }

}

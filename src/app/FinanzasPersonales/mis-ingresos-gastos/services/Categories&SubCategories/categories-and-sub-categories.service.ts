import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseCategory, Categories, SubCategories } from '../../interfaces/IncomeOrExpense.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesAndSubCategoriesService {

  private categoriesUrl = 'http://localhost:8080/income-or-expense-categories'

  constructor(private http: HttpClient) { }

  getCategories(justActives: boolean): Observable<Categories[]> {

    return this.http.get<Categories[]>(`${this.categoriesUrl}/get-by-user/${justActives}`)

  }

  display(element: BaseCategory): string {
    return element ? element.name : ''
  }

  saveCategory(category: Categories): Observable<Categories> {

    return this.http.post<Categories>(`${this.categoriesUrl}/save`, category)

  }

  deleteCategory(id: number): Observable<string> {

    return this.http.delete<any>(`${this.categoriesUrl}/delete/${id}`)
      .pipe(
        map(response => response.message)
      )

  }

  disableCategory(categoryId: number): Observable<void> {

    return this.http.post<void>(`${this.categoriesUrl}/disable`, categoryId)

  }

  enableCategory(categoryId: number): Observable<void> {

    return this.http.post<void>(`${this.categoriesUrl}/enable`, categoryId)

  }

}

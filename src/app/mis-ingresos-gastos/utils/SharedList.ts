import { signal } from "@angular/core";
import { Categories, IncomeOrExpense } from "../interfaces/IncomeOrExpense.interface";

export const allTransactions = signal<IncomeOrExpense[]>([])

export const incomeOrExpenseToEdit = signal<IncomeOrExpense | undefined>(undefined)

export const allCategories = signal<Categories[]>([])
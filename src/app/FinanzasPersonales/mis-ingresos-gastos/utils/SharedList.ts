import { signal } from "@angular/core";
import { IncomeOrExpense } from "../interfaces/IncomeOrExpense.interface";

export const allRecordsSignal = signal<IncomeOrExpense[]>([])
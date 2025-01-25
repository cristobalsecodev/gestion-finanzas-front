import { signal } from "@angular/core";
import { IncomeOrExpense } from "../interfaces.ts/IncomeOrExpense.interface";

export const allRecordsSignal = signal<IncomeOrExpense[]>([])
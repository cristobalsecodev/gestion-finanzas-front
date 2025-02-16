import { PaginationToSend } from "src/app/shared/interfaces/PaginationData.interface";

export interface FilterIncomeOrExpense extends PaginationToSend {

  categories: number[]
  subcategories: number[]
  fromDate: string | undefined
  toDate: string | undefined
  recurrences: string[] | undefined
  type: string | undefined
  currencies: string[]
  allRecords: boolean | undefined

}
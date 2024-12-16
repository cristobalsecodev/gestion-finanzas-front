import { PaginationToSend } from "src/app/shared/interfaces/PaginationData.interface";

export interface FilterIncomeOrExpense extends PaginationToSend {

  categorySubcategoryMap: any[]
  fromDate: string | undefined
  toDate: string | undefined
  recurrences: string[] | undefined
  type: string | undefined
  fromAmount: number | undefined
  toAmount: number | undefined

}
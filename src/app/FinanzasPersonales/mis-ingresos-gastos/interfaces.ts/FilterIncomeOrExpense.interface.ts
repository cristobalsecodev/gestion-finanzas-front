import { PaginationData } from "src/app/shared/interfaces/PaginationData.interface";

export interface FilterIncomeOrExpense extends PaginationData {

  notes: string | undefined
  categories: string[] | undefined
  subCategories: string[] | undefined
  startDate: string | undefined
  endDate: string | undefined
  recurrences: string[] | undefined
  type: string | undefined
  startAmount: number | undefined
  endAmount: number | undefined

}
export interface IncomeOrExpense {

  id?: number
  transactionDate: string // Fecha de efecto
  category: Categories // Categoría
  subcategory?: BaseCategory // Subcategoría
  amount: number // Cantidad
  currency: string // Divisa
  exchangeRateToUsd: number // Tipo de cambio en relación al USD
  type: 'income' | 'expense' // Tipo de registro
  notes?: string // Pequeña descripción
  recurrenceDetails?: RecurrenceDetails // Detalles de recurrencia en caso de que exista

}

export interface RecurrenceDetails {

  id?: number
  recurrenceType: 'daily' | 'weekly' | 'monthly' | 'yearly' // Tipo de recurrencia
  frequency: number // Frecuencia de repetición (e.g., cada 2 días, 1 semana, etc.)
  endDate?: string // Fecha de fin (opcional, si la recurrencia es limitada)
  occurrences?: number // Número de veces que ocurre la operación

}

export interface BaseCategory {

  id?: number
  name: string
  type: string
  active?: boolean

}

export interface Categories extends BaseCategory {

  linked?: boolean
  color: string
  subcategories: BaseCategory[]

}

export interface SubCategories extends BaseCategory {

  category: BaseCategory

}
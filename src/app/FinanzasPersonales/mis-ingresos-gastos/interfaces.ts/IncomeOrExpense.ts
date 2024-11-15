export interface IncomeOrExpense {

  id?: number
  date: Date // Fecha de efecto
  category: string // Categoría
  subCategory?: string // Subcategoría
  amount: number // Cantidad
  currency: string // Divisa
  type: 'income' | 'expense' // Tipo
  notes?: string // Pequeña descripción
  recurrenceDetails?: RecurrenceDetails // Detalles de recurrencia en caso de que exista

}

export interface RecurrenceDetails {

  id?: number
  recurrenceType: 'daily' | 'weekly' | 'monthly' | 'yearly' // Tipo de recurrencia
  frequency: number // Frecuencia de repetición (e.g., cada 2 días, 1 semana, etc.)
  endDate?: Date // Fecha de fin (opcional, si la recurrencia es limitada)
  occurrences?: number // Número de veces que ocurre la operación

}

export interface BaseCategory {
  id?: number;
  name: string;
  type: string;
}

export interface Categories extends BaseCategory {

  subcategories: BaseCategory[]

}

export interface SubCategories extends BaseCategory {

  category: BaseCategory

}
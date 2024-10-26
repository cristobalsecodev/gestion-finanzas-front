export interface StockForDay {
  afterHours: string
  close: number
  high: number
  low: number
  open: number
  preMarket: number
  volume: number
  date: Date
  symbol: string
  status: string
}

export interface StockForDayFilter {
  symbol: string
  date: Date
}
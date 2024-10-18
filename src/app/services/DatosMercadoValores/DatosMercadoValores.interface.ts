export interface ActivoDiaUnico {
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

export interface FiltroActivoDiaUnico {
  symbol: string
  date: Date
}
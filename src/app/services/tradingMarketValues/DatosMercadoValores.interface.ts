export interface Activo {
  information: string
  symbol: string
  lastRefreshed: Date
  outputSize: string
  timeZone: string
  dailyValues: ValoresMercado[]
}

export interface ValoresMercado {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface FiltroActivo {
  symbol: string
  outputSize: string
  periodType: string
  startDate: Date | undefined
  endDate: Date | undefined
}
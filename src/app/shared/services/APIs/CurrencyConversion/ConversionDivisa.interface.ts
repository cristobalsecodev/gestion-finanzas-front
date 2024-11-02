
export interface CurrencyConversion {
  result: string
  lastUpdatedDate: Date
  nextUpdateDate: Date
  originalCurrency: string
  exchangeRate: ExchangeRate[]
}

export interface ExchangeRate {
  currencyCode: string
  currencyName: string
  exchangeRate: number
}

export interface Currency {
  currencyCode: string
  currencyName: string
}
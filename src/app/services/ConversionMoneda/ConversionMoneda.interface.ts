
export interface ConversionMoneda {
  result: string
  timeLastUpdate: Date
  timeNextUpdate: Date
  originalCurrency: string
  conversionRates: RatioConversion[]
}

export interface RatioConversion {
  currencyCode: string
  currencyName: string
  conversionValue: number
}
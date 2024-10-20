
export interface ConversionDivisa {
  resultado: string
  fechaUltimaActualizacion: Date
  fechaSiguienteActualizacion: Date
  divisaOriginal: string
  ratiosConversion: RatioConversion[]
}

export interface RatioConversion {
  codigoDivisa: string
  nombreDivisa: string
  valorConversion: number
}

export interface Divisa {
  codigoDivisa: string
  nombreDivisa: string
}
import { Pipe, PipeTransform } from '@angular/core';
import { DivisaCodigoENUM } from '../enums/Divisa.enum';
import { SinValor } from '../constants/variables.constants';

@Pipe({
  name: 'simboloDivisa',
  standalone: true
})
export class SimboloDivisaPipe implements PipeTransform {

  divisaCodigos = DivisaCodigoENUM

  sinValor = SinValor

  transform(value: number, codigoDivisa: string = this.divisaCodigos.EUR): string {
    switch(codigoDivisa) {
      case this.divisaCodigos.EUR:
        return '€'
      case this.divisaCodigos.USD:
        return 'US$'
      case this.divisaCodigos.JPY:
        return '¥'
      case this.divisaCodigos.AUD:
        return 'A$'
      case this.divisaCodigos.CAD:
        return 'C$'
      case this.divisaCodigos.CHF:
        return 'CHF'
      case this.divisaCodigos.CNY:
        return '元'
      case this.divisaCodigos.NZD:
        return 'NZ$'
      case this.divisaCodigos.GBP:
        return '£'
      case this.divisaCodigos.INR:
        return '₹'
      default:
        return this.sinValor
    }

  }

}

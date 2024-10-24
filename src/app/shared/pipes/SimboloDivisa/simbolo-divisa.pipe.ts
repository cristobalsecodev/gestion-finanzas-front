import { Pipe, PipeTransform } from '@angular/core';
import { DivisaCodigoENUM } from '../../enums/Divisa.enum';
import { SinValor } from '../../constants/variables.constants';

@Pipe({
  name: 'simboloDivisa',
  standalone: true
})
export class SimboloDivisaPipe implements PipeTransform {

  readonly divisaCodigo = DivisaCodigoENUM

  readonly sinValor = SinValor

  transform(value: number, codigoDivisa: string = this.divisaCodigo.EUR): string {
    switch(codigoDivisa) {
      case this.divisaCodigo.EUR:
        return '€'
      case this.divisaCodigo.USD:
        return 'US$'
      case this.divisaCodigo.JPY:
        return '¥'
      case this.divisaCodigo.AUD:
        return 'A$'
      case this.divisaCodigo.CAD:
        return 'C$'
      case this.divisaCodigo.CHF:
        return 'CHF'
      case this.divisaCodigo.CNY:
        return '元'
      case this.divisaCodigo.NZD:
        return 'NZ$'
      case this.divisaCodigo.GBP:
        return '£'
      case this.divisaCodigo.INR:
        return '₹'
      default:
        return this.sinValor
    }

  }

}

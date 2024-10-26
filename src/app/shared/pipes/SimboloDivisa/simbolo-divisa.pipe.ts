import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyCodeENUM } from '../../enums/Currency.enum';
import { noValue } from '../../constants/variables.constants';

@Pipe({
  name: 'simboloDivisa',
  standalone: true
})
export class SimboloDivisaPipe implements PipeTransform {

  readonly currencyCode = CurrencyCodeENUM

  readonly noValue = noValue

  transform(value: number, currencyCode: string = this.currencyCode.EUR): string {
    switch(currencyCode) {
      case this.currencyCode.EUR:
        return '€'
      case this.currencyCode.USD:
        return '$'
      case this.currencyCode.JPY:
        return '¥'
      case this.currencyCode.AUD:
        return 'A$'
      case this.currencyCode.CAD:
        return 'C$'
      case this.currencyCode.CHF:
        return 'CHF'
      case this.currencyCode.CNY:
        return '元'
      case this.currencyCode.NZD:
        return 'NZ$'
      case this.currencyCode.GBP:
        return '£'
      case this.currencyCode.INR:
        return '₹'
      default:
        return this.noValue
    }

  }

}

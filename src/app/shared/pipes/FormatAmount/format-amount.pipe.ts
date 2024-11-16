import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAmount',
  standalone: true
})
export class FormatAmountPipe implements PipeTransform {

  transform(value: number): string {

    // Verifica si el valor es negativo
    const isNegative = value < 0;
    const absValue = Math.abs(value); // Obtiene el valor absoluto

    let formatted: string;

    // Formato para valores de Billones (T), Miles de millones (B), Millones (M) y Miles (K)
    if (absValue >= 1_000_000_000_000) {

      formatted = `${(absValue / 1_000_000_000_000).toFixed(2)}T`; // Billones

    } else if (absValue >= 1_000_000_000) {

      formatted = `${(absValue / 1_000_000_000).toFixed(2)}B`; // Miles de millones

    } else if (absValue >= 1_000_000) {

      formatted = `${(absValue / 1_000_000).toFixed(2)}M`; // Millones

    } else if (absValue >= 1_000) {

      formatted = `${(absValue / 1_000).toFixed(2)}K`; // Miles

    } else {

      formatted = absValue.toString(); // No formatea si es menos de 1000
      
    }

    // Añadir separadores de miles y signo negativo si es necesario
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return isNegative ? `-${formatted}` : formatted;
  }

}

import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatThousandSeparators',
  standalone: true
})
@Injectable({
  providedIn: 'root', // Hace que sea un servicio inyectable globalmente
})
export class FormatThousandSeparatorsPipe implements PipeTransform {

  transform(value: number): string {

    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  }

}

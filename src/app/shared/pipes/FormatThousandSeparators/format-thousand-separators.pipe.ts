import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatThousandSeparators',
  standalone: true
})
export class FormatThousandSeparatorsPipe implements PipeTransform {

  transform(value: number): string {

    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
  }

}

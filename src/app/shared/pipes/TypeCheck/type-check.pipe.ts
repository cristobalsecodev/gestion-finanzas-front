import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeCheck',
  standalone: true
})
export class TypeCheckPipe implements PipeTransform {

  transform(value: any, type: string): unknown {

    return typeof value === type
    
  }

}

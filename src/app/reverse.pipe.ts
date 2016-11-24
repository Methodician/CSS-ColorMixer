import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(array): any[] {
    var copy = [];
    if(array)
      copy = array.slice();
    return copy.reverse();
  }

}

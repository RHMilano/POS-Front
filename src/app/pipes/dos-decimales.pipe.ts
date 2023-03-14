import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dosDecimales'
})
export class DosDecimalesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return this.calc(value);
  }


  calc(theform) {
    const num = theform;
    const with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return with2Decimals;
  }

}

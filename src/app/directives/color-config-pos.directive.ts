import { Directive, ElementRef } from '@angular/core';
import { ConfigPosService } from '../services/config-pos.service';

@Directive({
  selector: '[appColorConfigPos]'
})

export class ColorConfigPosDirective {

  constructor(el: ElementRef, private _configPOS: ConfigPosService) {
    _configPOS.adfElementRef(el);
  }
}

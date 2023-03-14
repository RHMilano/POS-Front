import { Directive, ElementRef, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCashOnly]'
})
export class CashOnlyDirective {

  constructor(private el: ElementRef, @Self() private control: NgControl) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const e = <KeyboardEvent> event;


    // console.log('keycode===>', e.keyCode);

    if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39) ||
      (e.keyCode === 190)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode !== 190 && e.keyCode !== 110) {
      e.preventDefault();
    }

  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {

    if (this.el.nativeElement.value.indexOf('.') !== -1) {
      const numDecimales = this.el.nativeElement.value.split('.')[1].length;
      const numEnteros = this.el.nativeElement.value.split('.')[0].length;

      let enteros = this.el.nativeElement.value.split('.')[0];
      const decimales = this.el.nativeElement.value.split('.')[1];


      if (numEnteros > 6) {
        enteros = enteros.match(/^([0-9]{0,6})/)[0];
        this.el.nativeElement.value = `${enteros}.${decimales}`;
      }

      if (numDecimales > 2) {
        this.el.nativeElement.value = this.el.nativeElement.value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
      }


    } else {
      this.el.nativeElement.value = this.el.nativeElement.value.match(/^([0-9]{0,6})/)[0];
    }

    this.setValues();
  }

  @HostListener('paste', ['$event'])
  onPaste(event) {
    const pastedText = (event.originalEvent || event).clipboardData.getData('text/plain');
    if (pastedText) {
      this.setValues();
    }
  }

  setValues() {
    let tmpValue = this.el.nativeElement.value.toString().replace(/[^0-9.]/g, '');
    tmpValue = tmpValue.toString().replace(/[`*\[\]^]/g, '');
    tmpValue = this.process(tmpValue);
    this.el.nativeElement.value = tmpValue;
    this.control.control.setValue(tmpValue);
  }

  process(str) {
    return str.replace(/^([^.]*\.)(.*)$/, function (a, b, c) {
      return b + c.replace(/\./g, '');
    });
  }
}

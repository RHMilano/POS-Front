import { Directive, ElementRef, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

  constructor(private el: ElementRef, @Self() private control: NgControl) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const e = <KeyboardEvent> event;


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
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode !== 190 && e.keyCode !== 110) {
      e.preventDefault();
    }

  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
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
    let tmpValue = this.el.nativeElement.value.toString().replace(/[^0-9]/g, '');
    tmpValue = tmpValue.toString().replace(/[`*\[\]\^]/g, '');
    this.el.nativeElement.value = tmpValue;
    this.control.control.setValue(tmpValue);
  }
}

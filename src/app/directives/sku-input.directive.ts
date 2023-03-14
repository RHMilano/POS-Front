import { Directive, ElementRef, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSkuInput]'
})
export class SkuInputDirective {


  constructor(private el: ElementRef, @Self() private control: NgControl) {
  }


  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.el.nativeElement.value = this.el.nativeElement.value.toString().replace(/[^0-9A-za-z]/g, '');
    this.el.nativeElement.value = this.el.nativeElement.value.toString().replace(/[`*\[\]\^]/g, '');
    this.control.control.setValue(this.el.nativeElement.value);
  }


  @HostListener('paste', ['$event'])
  onPaste(event) {
    const pastedText = (event.originalEvent || event).clipboardData.getData('text/plain');

    if (pastedText) {
      this.el.nativeElement.value = this.el.nativeElement.value.toString().replace(/[^0-9A-za-z]/g, '');
      this.el.nativeElement.value = this.el.nativeElement.value.toString().replace(/[`*\[\]\^]/g, '');
      this.control.control.setValue(this.el.nativeElement.value);
    }
  }

}

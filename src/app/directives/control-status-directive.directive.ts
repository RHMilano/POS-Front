import { Directive, HostBinding, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({selector: '[appControlStatusDirectiveDirective]',
  host: {
    '(focus)': 'onFocus($event)',
    '(change)': 'onChange($event)',
    '(ngModelChange)': 'onNgModelChange($event)'
  }})

export class ControlStatusDirectiveDirective {

  @HostBinding('class.is-valid') isValid = false;
  @HostBinding('class.is-invalid') isInvalid = true;


  public constructor(private control: NgControl) {
  }

  onFocus($event) {
    this.isValid = this.ngClassValid;
    this.isInvalid = this.ngClassInvalid;
  }

  onChange($event) {
    this.isValid = this.ngClassValid;
    this.isInvalid = this.ngClassInvalid;
  }

  onNgModelChange($event) {
    this.isValid = this.ngClassValid;
    this.isInvalid = this.ngClassInvalid;
  }

  get ngClassValid(): boolean {

    if (this.control.control == null) {
      return false;
    }

    return this.control.control.valid;
  }

  get ngClassInvalid(): boolean {
    if (this.control.control == null) {
      return false;
    }

    return this.control.control.invalid;

  }

  @HostListener('keyup', ['$event'])
  keyup(event: KeyboardEvent) {

    this.isValid = this.ngClassValid;
    this.isInvalid = this.ngClassInvalid;
  }


}

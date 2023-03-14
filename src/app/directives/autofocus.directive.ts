import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { AlertService } from '../services/alert.service';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

  @Input('appAutofocus') applyFocus: any;

  constructor(private el: ElementRef, private _alertService: AlertService) {
  }

  ngAfterViewInit() {

    setTimeout(_ => {
      if (this.applyFocus === '' || this.applyFocus === true) {
        this.el.nativeElement.focus();
        this._alertService.focusOnUnblock.next(this.el);
      }
    });
  }

}

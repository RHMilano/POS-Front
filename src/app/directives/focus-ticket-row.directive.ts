import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { GLOBAL } from '../shared/GLOBAL';
import { RowSelectorInterface } from '../Models/FrontEnd/RowSelectorInterface';
import { AlertService } from '../services/alert.service';

@Directive({
  selector: '[appFocusTicketRow]',
  exportAs: 'focusRowReference'
})
export class FocusTicketRowDirective implements OnInit {

  @Input('appFocusTicketRow') callerInstance: RowSelectorInterface;
  @Input('useTabToBrowseRow') tabBrowse: boolean;
  @Input('selectOnEnter') selectOnEnter: boolean;
  @Input('selectFirstOnFocus') selectOnFocus: boolean;
  @Input('arrowPaginate') paginateOnArrow: boolean;
  @Input('addInputToFocus') addInputToFocus: boolean;

  inputToFocus: HTMLTemplateElement;
  isBackgroundWorking: boolean;


  constructor(private el: ElementRef, private renderer: Renderer2, private _alertSevice: AlertService) {
  }

  ngOnInit(): void {

    this._alertSevice.backgroundWork.subscribe(backgroundWork => this.isBackgroundWorking = backgroundWork);


    if (this.addInputToFocus) {
      this.inputToFocus = this.renderer.createElement('input');
      this.renderer.addClass(this.inputToFocus, 'form-control-plaintext');
      this.renderer.addClass(this.inputToFocus, 'inputToFocus');
      this.renderer.appendChild(this.el.nativeElement, this.inputToFocus);
    }

  }


  selectFirstTime() {
    this.inputToFocus.focus();
    this.callerInstance.selectFirstRow();
  }

  @HostListener('focusin', ['$event'])
  onFocus(event) {

    if (this.isBackgroundWorking) {
      event.preventDefault();
      return;
    }

    if (this.selectOnFocus) {
      this.callerInstance.selectFirstRow();
    }

    this.renderer.addClass(this.el.nativeElement, 'tableSelected');
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event) {
    this.renderer.removeClass(this.el.nativeElement, 'tableSelected');
    if (this.isBackgroundWorking) {
      event.preventDefault();
      return;
    }
  }

  @HostListener('keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {

    if (this.isBackgroundWorking) {
      event.preventDefault();
      return;
    }

    const keyCode = event.which || event.keyCode;

    if (keyCode === 13 && this.selectOnEnter) {
      this.callerInstance.selectOnEnter();
      event.preventDefault();
      return;
    }


    if (keyCode === 40 || keyCode === 38) {

      if (keyCode === 40) {
        this.callerInstance.selectRowDown();
      }
      if (keyCode === 38) {
        this.callerInstance.selectRowUp();
      }
    }

    if (this.paginateOnArrow) {
      if (keyCode === 39) {
        this.callerInstance.pageForward();
      } else if (keyCode === 37) {
        this.callerInstance.pageBackward();
      }
    }


    if (this.tabBrowse) {
      if (!event.shiftKey && keyCode === 9 && !this.callerInstance.isLastRow()) {
        this.callerInstance.selectRowDown();
        event.preventDefault();
      } else if (event.shiftKey && keyCode === 9 && !this.callerInstance.isFirstRow()) {
        this.callerInstance.selectRowUp();
        event.preventDefault();
      } else if (event.shiftKey && keyCode === 9 && this.callerInstance.isFirstRow() && this.callerInstance.jumpFocusToPrevElement) {
        this.callerInstance.jumpFocusToPrevElement();
        event.preventDefault();
      } else if (keyCode === 9 && this.callerInstance.isLastRow() && this.callerInstance.jumpFocusToNextElement) {
        this.callerInstance.jumpFocusToNextElement();
        event.preventDefault();
      }
    }
    const preventDefaults = ['112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123'];
    if ((event.which || event.keyCode) && GLOBAL.includesAny((event.which || event.keyCode).toString(), preventDefaults)) {
      event.preventDefault();
    }
  }

}

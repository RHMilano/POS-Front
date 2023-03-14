import { AfterViewInit, Directive, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AlertService } from '../services/alert.service';

@Directive({
  selector: '[appModalFocus]',
  exportAs: 'modalFocusReference'
})
export class ModalFocusDirective implements AfterViewInit, OnInit, OnDestroy {

  allElements: Array<HTMLInputElement>;
  elements: Array<HTMLInputElement>;
  lastElement: HTMLInputElement;
  firstElement: HTMLInputElement;
  isFirstFocused = false;
  isLastFocused = false;
  currentFocus: HTMLInputElement;
  isBackgroundWorking: boolean;
  isBackgroundWorkingSub;

  constructor(private _render: Renderer2, private _alertSevice: AlertService) {
  }

  ngOnInit(): void {
    this.isBackgroundWorkingSub = this._alertSevice.backgroundWork.subscribe(backgroundWork => this.isBackgroundWorking = backgroundWork);

  }

  ngOnDestroy(): void {
    this.isBackgroundWorkingSub.unsubscribe();
  }


  ngAfterViewInit(): void {
    this.getElements();
  }

  getElements() {
    this.allElements = Array.prototype.slice.call(document.querySelectorAll('.modal-content *'));
    this.allElements.map((x, index) => x.id = 'GenModalId' + index);
    this.elements = this.allElements.filter(element => element.nodeName === 'INPUT' || element.nodeName === 'BUTTON' || element.nodeName === 'SELECT' || element.nodeName === 'LI');
    this.elements.map((x, index) => x['myTabIndex'] = index);
    this.firstElement = this.elements[0];
    this.lastElement = this.elements[this.elements.length - 1];
  }

  toggleElements(value: string) {
    this.getElements();
    this.elements.forEach(elem => {
      if (value === 'true') {
        this._render.setAttribute(elem, 'disabled', value);
      } else {
        this._render.removeAttribute(elem, 'disabled');
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    this.getElements();


    if (this.isBackgroundWorking) {
      event.preventDefault();
      return;
    }

    const keyCode = event.which || event.keyCode;


    const last = this.getLastAvailable();
    const first = this.getFirstAvailable();

    if (!this.currentFocus) {
      event.preventDefault();
      return;
    }

    if (this.currentFocus['myTabIndex'] === last['myTabIndex']) {
      this.isLastFocused = true;
      this.isFirstFocused = false;
    } else if (this.currentFocus['myTabIndex'] === first['myTabIndex']) {
      this.isLastFocused = false;
      this.isFirstFocused = true;
    } else {
      this.isLastFocused = false;
      this.isFirstFocused = false;
    }

    if (keyCode === 9) {


      if (event.shiftKey && this.isFirstFocused) {
        const elem = this.currentFocus = this.getLastAvailable();
        elem.focus();
        this.isFirstFocused = false;
        event.preventDefault();
        return;
      } else if (this.isFirstFocused) {
        this.isLastFocused = false;
        this.isFirstFocused = false;
        return;

      } else if (event.shiftKey && this.isLastFocused) {
        this.isLastFocused = false;
        this.isFirstFocused = false;
        return;

      } else if (this.isLastFocused) {

        const lastAval = this.getLastAvailable();

        if (lastAval['myTabIndex'] !== this.currentFocus['myTabIndex']) {
          lastAval.focus();
        } else {
          this.getFirstAvailable().focus();
        }


        event.preventDefault();
        return;

      }


    }
  }

  getFirstAvailable() {
    return this.elements.find(element => !element.hasAttribute('disabled'));
  }

  getLastAvailable() {
    return this.elements.filter(element => !element.hasAttribute('disabled')).slice(-1)[0];
  }

  @HostListener('document:focusin', ['$event'])
  onFocusIn(event: FocusEvent) {

    this.getElements();

    if (this.isBackgroundWorking) {
      event.preventDefault();
      return;
    }

    const firstAvailable = this.getFirstAvailable();
    const lastAvailable = this.getLastAvailable();

    if (!event.target['id'] || (event.target['id'] && !this.allElements.find(elems => elems.id === event.target['id']))) {

      try {
        firstAvailable.focus();
        this.currentFocus = firstAvailable;
        this.isFirstFocused = true;
        this.isLastFocused = false;
        event.preventDefault();
      } catch (e) {
      } finally {
        return;
      }
    }

    this.currentFocus = <HTMLInputElement>event.target;

    if (event.target['myTabIndex'] === firstAvailable['myTabIndex']) {
      this.isFirstFocused = true;
      this.isLastFocused = false;
    } else if (event.target['myTabIndex'] === lastAvailable['myTabIndex']) {
      this.isFirstFocused = false;
      this.isLastFocused = true;
    }

  }

}

import { ElementRef, Injectable } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { IAlerta } from '../Models/General/alert.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AlertService {


  DEFAULT_TIMEOUT = 60000;
  activeToast: ActiveToast<any>;
  activeRequests: Array<{ id: number, subscription: Subscription }> = [];
  elements: Array<HTMLInputElement>;
  elementLogout:  Array<HTMLInputElement>;

  backgroundWork: BehaviorSubject<boolean> = new BehaviorSubject(null);
  focusOnUnblock: BehaviorSubject<ElementRef> = new BehaviorSubject(null);

  elemToFocusOnUnblock: ElementRef;

  constructor(public toastr: ToastrService) {

    this.focusOnUnblock.subscribe(elemToFocus => {
      this.elemToFocusOnUnblock = elemToFocus;
    });

  }

  show(alertConfig: IAlerta) {
    this.toastr[alertConfig.tipo](
      alertConfig.mensaje, alertConfig.titulo
    );
  }


  startTimeoutAlert(randomId: number, url: string) {

    const subscription = Observable.interval(5000).take(1).subscribe(() => {
      this.showTiemoutAlert(url);
    });

    this.activeRequests.push({id: randomId, subscription: subscription});

    if (this.activeRequests.length <= 1 && !url.includes('/PosServiciosMIlano/General/GeneralService.svc/almacenarImagenRemota')) {
      this.getElements();
    }

    this.backgroundWork.next(true);

  }

  showTiemoutAlert(url: string) {
    if (!this.activeToast && !url.includes('/PosServiciosMIlano/General/GeneralService.svc/almacenarImagenRemota')) {
      this.activeToast = this.toastr.warning(
        'El servidor esta tardando m\u00E1s de lo habitual.\n Por favor espere.',
        'Milano', {
          progressBar: true,
          timeOut: this.DEFAULT_TIMEOUT - 5000,
          closeButton: true
        }
      );
    }
  }

  removeTimeOutAlertIfAny(randomId: number) {

    const request = this.activeRequests.findIndex((value) => {
      if (value.id === randomId) {
        value.subscription.unsubscribe();
        return true;
      }
    });

    if (request !== -1) {
      this.activeRequests.splice(request, 1);
    }

    if (!this.activeRequests.length) {
      if (this.activeToast) {
        this.toastr.clear(this.activeToast.toastId);
        this.activeToast = null;
      }
      this.unBlockElements();
    }
  }

  getElements() {
    this.elements = Array.prototype.slice.call(document.querySelectorAll('INPUT, BUTTON,SELECT,A, .btn_funcion'));
    this.elements.forEach(elem => {
      if (!elem.hasAttribute('hidden') && elem.id !== 'logout') {
        elem.setAttribute('wasDisabled', elem.hasAttribute('disabled') ? 'true' : 'false');
        elem.setAttribute('disabled', 'true');
      }

    });
  }


  getSkuBlock() {
    this.elements = Array.prototype.slice.call(document.querySelectorAll('INPUT, BUTTON'));
    this.elements.forEach(elem => {
      if (elem.id === 'logout' || elem.name === 'sku') {
        elem.setAttribute('wasDisabled', elem.hasAttribute('disabled') ? 'true' : 'false');
        elem.setAttribute('disabled', 'true');
      }
    });
  }

  unBlockElements() {

    if (!this.elements || !this.elements.length) {
      return;
    }


    this.elements.forEach(elem => {
      if (elem.hasAttribute('wasDisabled') && elem.getAttribute('wasDisabled') === 'false') {
        elem.removeAttribute('disabled');
      }
    });

    this.backgroundWork.next(false);

    if (this.elemToFocusOnUnblock) {
      setTimeout(_ => {
        this.elemToFocusOnUnblock.nativeElement.focus();
        this.elemToFocusOnUnblock = null;
      });

    }
  }
}

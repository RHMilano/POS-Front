import { AuthAndExecSUDO, SuperUserCallback } from './SuperUserCallback.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SuperUsuarioComponent } from '../../layout/super-usuario/super-usuario.component';
import { AuthService } from '../../services/auth.service';

export class SudoCallbackFactory implements SuperUserCallback {

  component: any;
  callBack: string;
  authAndExec: AuthAndExecSUDO;
  passthroughAdmin: boolean;
  ModalLevel: number;
  callbackParams?: Array<any>;
  cancelCallback: string;
  cancelCallbackParams: Array<any>;
  backdrop: string;
  keyboard: boolean;
  modalRef: BsModalRef;
  modalService: BsModalService;
  staticMode: boolean;

  constructor(params: SuperUserCallback = {} as SuperUserCallback) {
    const {
      component = {},
      callBack = '',
      cancelCallback = '',
      authAndExec = {params: null, path: ''},
      passthroughAdmin = false,
      ModalLevel = 1,
      callbackParams = [],
      cancelCallbackParams = [],
      backdrop = '',
      keyboard = true,
      modalService = null,
      staticMode = false
    } = params;
    this.component = component;
    this.callBack = callBack;
    this.authAndExec = authAndExec;
    this.passthroughAdmin = passthroughAdmin;
    this.ModalLevel = ModalLevel;
    this.callbackParams = callbackParams;
    this.modalService = modalService;
    this.cancelCallback = cancelCallback;
    this.cancelCallbackParams = cancelCallbackParams;
    this.backdrop = backdrop;
    this.keyboard = keyboard;
    this.staticMode = staticMode;

    if (this.modalService) {
      const initialState = this.getInitialState();
      this.modalService.show(SuperUsuarioComponent, {
        class: 'modal-md', backdrop: 'static', keyboard: this.keyboard, initialState
      }).content.action.take(1).subscribe(
        this.callBackFn()
      );
    }
  }

  getInitialState() {
    return {
      ModalLevel: this.ModalLevel,
      passthroughAdmin: this.passthroughAdmin,
      authAndExec: this.authAndExec,
      _modalService: this.modalService,
      staticMode: this.staticMode
    };
  }

  callBackFn() {
    return (value) => {

      if (value) {
        this.component[this.callBack].call(this.component, ...[...this.callbackParams, value]);
      } else {
        if (this.cancelCallback) {
          this.component[this.cancelCallback].call(this.component, ...[...this.cancelCallbackParams, value]);
        }
      }

    };
  }

}

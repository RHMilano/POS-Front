import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { GeneralService } from '../../services/general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { AuthAndExecSUDO } from '../../Models/General/SuperUserCallback.model';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../Models/LoginRequest';
import { AlertService } from '../../services/alert.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-super-usuario',
  templateUrl: './super-usuario.component.html',
  styleUrls: ['./super-usuario.component.css'],
  providers: [GeneralService]
})
export class SuperUsuarioComponent implements OnInit, OnDestroy {
  @Output() action = new EventEmitter();
  @Input() ModalLevel = 1;
  @Input() authAndExec: AuthAndExecSUDO;
  @Input() passthroughAdmin: boolean;
  @Input() _modalService: BsModalService;
  @Input() staticMode: boolean;

  modalRef: BsModalRef;
  superUser: string;
  superPass: string;
  modalServ: BsModalService;
  RealPassword = '';
  resetPassword: boolean;
  showStatic: boolean;

  @ViewChild('passwordInput') passwordInput: ElementRef;
  keyboardUnListener: () => void;
  oldInputValue = '';
  isMobileDev: boolean;


  constructor(private modalService: BsModalService, private _http: HttpClient,
              private _authService: AuthService, private _alertService: AlertService, private _auth: AuthService
    , private deviceService: DeviceDetectorService, private renderer: Renderer2) {
    this.isMobileDev = deviceService.isTablet() || deviceService.isMobile();
  }

  ngOnDestroy(): void {
    if (this.isMobileDev) {
      this.keyboardUnListener();
    }
  }

  ngOnInit() {
    this.modalServ = this._modalService || this.modalService;
    this.showStatic = !this.staticMode;

    if (this.isMobileDev) {
      this.keyboardUnListener = this.renderer.listen(this.passwordInput.nativeElement, 'input', this.inputEvent());
    }

  }

  getAccess() {

    const credentials = btoa(this.superUser + ':' + this.RealPassword);
    const request = new LoginRequest();
    request.numberEmployee = Number(this.superUser);
    request.password = this.RealPassword;

    this._authService.validateUser(request).subscribe(resp => {
      if (Number(resp.codeNumber) === 100) {
        setTimeout(() => {
          this.closeModal();
          this._auth.sudoInfo.next(credentials);
          this.action.emit(true); // timeout evita que se encimen los eventos del teclado
        }, 100);

        let verifica = localStorage.getItem('ConfirmaCancelarTransaccion');
        if ( verifica == '1' ) {
          localStorage.setItem('CodigoCajeroAutorizo', request.numberEmployee.toString());
        }

      } else {
        this._alertService.show({
          titulo: 'Milano',
          mensaje: resp.codeDescription,
          tipo: 'error'
        });
      }
    });
  }

  excecuteService() {

    const authExec = this.authAndExec;
    const credentials = btoa(this.superUser + ':' + this.RealPassword);
    const headers = new HttpHeaders().set('SUDO', credentials);
    const path = `${env.urlServices}${env[authExec.path]}`;

    this._http.post(path, JSON.stringify(authExec.params), {headers}).subscribe(resp => {
      setTimeout(() => {
        this.action.emit(true); // timeout evita que se encimen los eventos del teclado
      }, 100);
      this.closeModal();
    });

  }

  cancelSudo() {

    setTimeout(() => {
      this.action.emit(false); // timeout evita que se encimen los eventos del teclado
    }, 100);

    this.closeModal();
  }

  closeModal() {
    this.modalServ._hideModal(this.ModalLevel);
    if (Number(this.ModalLevel) === 1) {
    }
  }

  onSubmit() {

    if (this.passthroughAdmin) {
      this.getAccess();
    } else {
      this.excecuteService();
    }
    return;
  }

  passOfucate(event) {
    this.resetPasswordFn();
    const keyCode = event.which || event.code;
    if (keyCode !== 13) {
      if (this.superPass === undefined) {
        this.superPass = '';
      }
      this.RealPassword = this.RealPassword + String.fromCharCode(keyCode);
      this.superPass += '*';
      event.preventDefault();
    }
  }

  keyDownPass(event) {
    this.resetPasswordFn();
    const keyCode = event.which || event.code;
    if (keyCode === 8 || keyCode === 46 || keyCode === 37 || keyCode === 39) {
      this.superPass = undefined;
      this.RealPassword = '';
      event.preventDefault();
    }
  }

  inputEvent() {

    return (event) => {
      const oldLen = this.oldInputValue.length;
      const newLen = event.target.value.length;

      const [lastChar] = event.target.value.split('').splice(-1);

      if (newLen <= oldLen) { // backspace
        this.resetPassword = true;
        this.resetPasswordFn();
      } else {
        this.RealPassword += lastChar;
        this.superPass = '*'.repeat(this.RealPassword.length);
      }
    };
  }

  resetPasswordFn() {
    if (this.resetPassword) {
      this.superPass = '';
      this.RealPassword = '';
      this.resetPassword = false;
    }
  }

  passwordSelect(event) {
    this.resetPassword = true;
  }


  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    const keyCode = event.which || event.keyCode;

    if (keyCode === 27) {
      setTimeout(() => {
        this.action.emit(false);
      }, 100);
    }
  }

}

import {AfterViewInit, Component, ElementRef, Injectable, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {LoginRequest} from '../../Models/LoginRequest';
import 'rxjs/add/operator/do';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/takeLast';
import {MsgService} from '../../services/msg.service';
import {GeneralService} from '../../services/general.service';
import {ConfigPosService} from '../../services/config-pos.service';
import {ConfiguracionBoton} from '../../Models/General/ConfiguracionBoton';
import {Botones} from '../../Models/General/Funciones.model';
import {NgForm} from '@angular/forms';
import {environment as env, environment} from '../../../environments/environment';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DataTransferService} from '../../services/data-transfer.service';
import {LoginComponentInterface} from '../../Models/FrontEnd/LoginComponentInterface';
import {ResponseBusiness} from '../../Models/General/ResponseBusiness.model';
import {UserResponse} from '../../Models/Security/User.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CompaniasResponse} from '../../Models/General/Companias';
import {InformacionVersionSoftware} from '../../Models/General/InformacionVersionSoftware';
import {AlertService} from '../../services/alert.service';
import {EstatusActualizacionSoftwareResponse} from '../../Models/General/EstatusActualizacionSoftwareResponse';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {FormasDePagoComponentInterface} from '../../Models/FrontEnd/FormasDePagoComponentInterface';
import { CambiarPasswordComponent } from '../cambiar-password/cambiar-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [GeneralService]
})

@Injectable()
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit, LoginComponentInterface {

  NumberEmployee: number;
  Password: string;
  NumberAttempts: number;
  TokenDevice: string;
  RealPassword = '';
  processLogin = false;
  version = environment.VERSION;
  versionSeg;
  versionSer;
  modalRef: BsModalRef;
  resetPassword: boolean;
  keyboardUnListener: () => void;
  oldInputValue = '';
  isMobileDev: boolean;
  estatus: EstatusActualizacionSoftwareResponse;
  _posversion:string; //OCG: Número de versión de los enviroments
  ForzarF5_o_Actualizacion = false;
  ForzarF5_o_Actualizacion_MSG = '';

  @ViewChild('formLogin') formLogin: NgForm;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('estatusTemplate') estatusTemplate: TemplateRef<any>;

  constructor(private _authService: AuthService, private _router: Router, private _generalService: GeneralService
    , private _msg: MsgService, private renderer: Renderer2, public _configService: ConfigPosService,
              private _alertService: AlertService, public modalService: BsModalService,
              private deviceService: DeviceDetectorService, public _dataTransfer: DataTransferService, private _http: HttpClient,
              private activatedRoute: ActivatedRoute
              ) {

    this.renderer.addClass(document.body, 'image-background-1');
    this.isMobileDev = deviceService.isTablet() || deviceService.isMobile();
    this._posversion = env.posversion; //OCG: Número de versión de los enviroments

  }

  ngAfterViewInit(): void {
    const endpointSec = `${env.urlSecurity}${env.versionSeg}`;
    const endpointSer = `${env.urlSecurity}${env.versionServ}`;
    const endpointSoft = `${env.urlSecurity}${env.verificaSoftware}/${env.posversion}` ;

    // this._http.get<ResponseBusiness<String>>(endpointSec).subscribe(res => {
    //   this.versionSeg = res.data;
    // });

    // this._http.get<ResponseBusiness<String>>(endpointSer).subscribe(resp => {
    //   this.versionSer = resp.data;
    // });
    
    this.versionSer = 'Version POS CAJA';

    this._http.get<any>(endpointSoft).subscribe(resp => {
      console.log(JSON.stringify(resp))
      if (resp.data.split(',')[0] == 0) {
        this.ForzarF5_o_Actualizacion = true;
        this.ForzarF5_o_Actualizacion_MSG = resp.data.split(',')[1];
        this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: this.ForzarF5_o_Actualizacion_MSG });
      }
    });

    if (environment.autoLogin) {
      setTimeout(() => this.login(), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.isMobileDev) {
      this.keyboardUnListener();
    }
  }


  ngOnInit() {

    this.NumberAttempts = 1;

    if (this.isMobileDev) {
      this.keyboardUnListener = this.renderer.listen(this.passwordInput.nativeElement, 'input', this.inputEvent());
    }
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.TokenDevice = params['tkn'] || '';
    });

  }

  login() {

    if (this.ForzarF5_o_Actualizacion) {
      this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: this.ForzarF5_o_Actualizacion_MSG });
      return;
    }

    const loginRequest = new LoginRequest({
      numberAttempts: this.NumberAttempts,
      password: this.RealPassword,
      numberEmployee: this.NumberEmployee,
      tokenDevice: this.TokenDevice,
      esLoginInicial: 1
    });

    if (!this.processLogin) {

      this.processLogin = true;

      //this.formLogin.form.disable();

      this._authService.login(loginRequest).then(

        () => this.getConfig()

       ).then(
         _ => {
           // this.processLogin = false;

           if (JSON.parse(localStorage.getItem('accessInfo')).vencioPassword === 2) {
             this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: 'La contraseña venció, debe cambiarla.' });
             setTimeout(() => {
               this.Password = '';
               this.processLogin = false;
               const options: ModalOptions = {
                 class: 'modal-md',
                 backdrop: 'static'
                 // initialState: {authorized: true}
               };
               this.modalService.show(CambiarPasswordComponent, options);
             }, 3000);
           } else {
             this.processLogin = false;
             return this._router.navigate(['POS']);
           }

         }
       ).catch(
         msg => {
           this.formLogin.form.enable();
           this._msg.setMsg({message: msg , tipo: 'error'});
           this.RealPassword = '';
           this.Password = '';
           this.processLogin = false;
         }
       );

      /*
      this._generalService.comprobarVersionService().subscribe( resp => {
        //OCG: console.log('Validando login this._generalService.comprobarVersionService()');
        //OCG: console.log(`resp.codeNumber: ${resp.codeNumber}` );  ng build --prod --outputHashing=all
        if (Number(resp.codeNumber) === 900 || Number(resp.codeNumber) === 904) {
          // OCG: Mensaje de actualización automática "verde"
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: resp.codeDescription });

          this._authService.login(loginRequest).then(

           () => this.getConfig()

          ).then(
            _ => {
              // this.processLogin = false;
              // console.log(`return this._router.navigate(['POS']);`);
              // return this._router.navigate(['POS']);

              if (JSON.parse(localStorage.getItem('accessInfo')).vencioPassword === 2) {
                this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: 'La contraseña venció, debe cambiarla.' });
                setTimeout(() => {
                  this.Password = '';
                  this.processLogin = false;
                  const options: ModalOptions = {
                    class: 'modal-md',
                    backdrop: 'static'
                    // initialState: {authorized: true}
                  };
                  this.modalService.show(CambiarPasswordComponent, options);
                }, 3000);
              } else {
                this.processLogin = false;
                return this._router.navigate(['POS']);
              }

            }
          ).catch(
            msg => {
              this.formLogin.form.enable();
              this._msg.setMsg({message: msg , tipo: 'error'});
              this.RealPassword = '';
              this.Password = '';
              this.processLogin = false;
            }
          );
        } else if (Number(resp.codeNumber) === 903) {
          this._generalService.actualizarVersionSoftwareService(resp.informacionVersionesSoftwarePendientesPorInstalar).subscribe( data => {
              if (Number(data.codeNumber) === 910 || Number(data.codeNumber) === 911) {
                this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: data.codeDescription});
                this.formLogin.form.enable();
                this.processLogin = false;
                this.resetPasswordFn();
              }
          });
        }  else if (Number(resp.codeNumber) === 905) {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: resp.codeDescription});
          this._generalService.estatusVersionSoftwareService().subscribe( data => {
              this.estatus = data;
              this.modalRef = this.modalService.show(this.estatusTemplate, {backdrop: 'static', keyboard: false});
          });
        } else {
          this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: resp.codeDescription});
        }
      });

      */
    }
  }

  getConfig() {
    return new Promise((resolve, reject) => {

      this._generalService.ConfigGeneralesCajaTiendaService().subscribe(
        data => {

          console.log(`getConfig: ${JSON.stringify(data)}`);
          //debugger;
          const btnArray = data.configuracionBotonera.configuracionBotones.map((btn) => {
            Botones[btn.identificador] = btn.identificador;
            return new ConfiguracionBoton(btn);
          }).sort((a, b) => a.orden - b.orden);

          this._dataTransfer.$loginInstance.next(this);
          this._configService.setBotones(btnArray);
          this._configService.setConfig(data);

          resolve(true);
        },
        () => {
          this._configService.configLoaded.next(null);
          reject(false);
        }
      );

    });

  }

  passOfucate(event) {

    this.resetPasswordFn();

    const keyCode = event.which || event.code;
    if (keyCode !== 13) {
      if (this.Password === undefined) {
        this.Password = '';
      }
      this.RealPassword = this.RealPassword + String.fromCharCode(keyCode);
      this.Password += '*';
      event.preventDefault();
    }
  }

  keyDownPass(event) {

    this.oldInputValue = event.target.value;

    this.resetPasswordFn();
    const keyCode = event.which || event.code;
    if (keyCode === 8 || keyCode === 46 || keyCode === 37 || keyCode === 39) {
      this.Password = undefined;
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
        this.Password = '*'.repeat(this.RealPassword.length);
      }
    };
  }

  resetPasswordFn() {
    if (this.resetPassword) {
      this.Password = '';
      this.RealPassword = '';
      this.resetPassword = false;
    }
  }

  closeModal() {
    this.modalRef.hide();
    this.formLogin.form.enable();
    this.processLogin = false;
    this.resetPasswordFn();
  }

  passwordSelect(event) {
    this.resetPassword = true;
  }
}

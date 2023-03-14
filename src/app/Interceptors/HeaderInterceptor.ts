import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../shared/GLOBAL';
import { TimeoutError } from 'rxjs/util/TimeoutError';
import { MsgService } from '../services/msg.service';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/sample';
import { AlertService } from '../services/alert.service';
import 'rxjs/add/operator/isEmpty';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import { ResponseBusiness } from '../Models/General/ResponseBusiness.model';
import { AuthService } from '../services/auth.service';
import { ConfigPosService } from '../services/config-pos.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  DEFAULT_TIMEOUT = 180000;
  sudoCredentials: string;


  constructor(private _msg: MsgService, private _alertService: AlertService, private _auth: AuthService, private _configPos: ConfigPosService) {
    this._auth.sudoInfo.subscribe((credentials: string) => {
      this.sudoCredentials = credentials;
    });

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const timeout = Number(req.headers.get('timeout')) || this.DEFAULT_TIMEOUT;

    const headers = {
      'Content-Type': 'application/json'
    };


    const excludeAuth = ['login'];

    if (!GLOBAL.includesAny(req.url, excludeAuth)) {
      headers['Authorization'] = localStorage.getItem('accesstoken') || '';
    }


    if (this._configPos.currentConfig) {

      if (GLOBAL.includesAny(
        req.url.split('/').splice(-1, 1), this._configPos.currentConfig.informacionCatalogoRecursos.map(x => x.endpoint)
      )) {
        headers['SUDO'] = this.sudoCredentials;
      }
    }

    const dummyrequest = req.clone({
      setHeaders: headers,
      withCredentials: true
    });

    const timeoutId = Math.floor((Math.random() * 999999) + 1);
    this._alertService.startTimeoutAlert(timeoutId, req.url);


    const requestObserver = next.handle(dummyrequest).timeout(timeout).do(() => {
    }, err => {
      this._alertService.removeTimeOutAlertIfAny(timeoutId);

      if (err instanceof HttpErrorResponse) {
        this._msg.setMsg({
          message: `${err.status} - ${err.statusText}`, tipo: 'error'
        });
      }
      if (err instanceof TimeoutError) {
        this._msg.setMsg({
          message: 'El tiempo de espera de la petici\u00F3n se ha agotado.\nIntente de nuevo.', tipo: 'error'
        });
      }
    }).map(resp => {
      //debugger
      if (resp instanceof HttpResponse) {
        this._alertService.removeTimeOutAlertIfAny(timeoutId);
      }

      const response = <HttpResponse<ResponseBusiness<Object>>> resp;
      const body = JSON.parse(req.body);
      if (body && body.avoidMsg) {
        return resp;
      }
      // servicio ejecutado correctamente, pero hubo error interno... alerta para todos los servicios en general
      if (response.status === 200 && !response.body.result.status) {
        let msgerror = response.body.result.error == '' ? response.body.result.codeDescription : response.body.result.error;
        this._msg.setMsg({message: `${msgerror}`, tipo: 'error'});
        throw new HttpErrorResponse({});
      } else {
        return resp;
      }
    });

    return requestObserver;
  }

}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ResponseBusiness } from '../Models/General/ResponseBusiness.model';
import { MsgService } from '../services/msg.service';
import { AlertService } from '../services/alert.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private _msg: MsgService, private _alertService: AlertService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).map(resp => {


      if (resp instanceof HttpResponse) {
      }

      const response = <HttpResponse<ResponseBusiness<Object>>> resp;
      const body = JSON.parse(req.body);
      if (body && body.avoidMsg) {
        return resp;
      }
      //debugger;
      // servicio ejecutado correctamente, pero hubo error interno... alerta para todos los servicios en general
      if (response.status === 200 && !response.body.result.status) {
       
        let msgerror = response.body.result.error == '' ? response.body.result.codeDescription : response.body.result.error;
        this._msg.setMsg({message: `${response.body.result.codeNumber} ${msgerror}`, tipo: 'error'});
      }
      return resp;
    });

  }
}

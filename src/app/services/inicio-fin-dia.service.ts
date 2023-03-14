import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { EstatusResult, ResponseBusiness } from '../Models/General/ResponseBusiness.model';
import { InicioDiaResponse } from '../Models/InicioFin/InicioDiaResponse';
import { CapturaLuzRequest } from '../Models/InicioFin/CapturaLuzRequest';
import { AutenticacionOfflineRequest } from '../Models/InicioFin/AutenticacionOfflineRequest';
import { FinDiaResponse } from '../Models/InicioFin/FinDiaResponse';
import { CashOutResponse } from '../Models/InicioFin/CashOutResponse';
import { HttpClient } from '@angular/common/http';
import { RelacionCaja } from '../Models/InicioFin/RelacionCaja';
import { LecturaCaja } from '../Models/General/LecturaCaja';
import { VentaResponseModel } from '../Models/Sales/VentaResponse.model';
import { LecturaTotalDetalleFormaPago } from '../Models/General/LecturaTotalDetalleFormaPago';

@Injectable()
export class InicioFinDiaService {

  constructor(private _http: HttpClient) { }

  inicioDiaService() {
    const endpoint = `${env.urlServices}${env.inicioDiaPath}`;
    return this._http.get<ResponseBusiness<InicioDiaResponse>>(
      endpoint).map(res => res.data);
  }

  //-NOTA: Servicio para capturar el inicio de dia
  capturaLuzService(request: CapturaLuzRequest) {
    //alert(JSON.stringify(request));
    const endpoint = `${env.urlServices}${env.capturaLuzPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  autenticacionOfflineService(request: AutenticacionOfflineRequest) {
    const endpoint = `${env.urlServices}${env.autenticacionOfflinePath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  finDiaService() {
    const endpoint = `${env.urlServices}${env.finDiaPath}`;
    return this._http.get<ResponseBusiness<FinDiaResponse>>(
      endpoint).map(res => res.data);
  }

  capturaLuzFinService(request: CapturaLuzRequest) {
    const endpoint = `${env.urlServices}${env.capturaLuzFinPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  cashOutService() {
    const endpoint = `${env.urlServices}${env.cashOutPath}`;
    return this._http.get<ResponseBusiness<CashOutResponse>>(
      endpoint).map(res => res.data);
  }

  actualizarCashOutService(request: CashOutResponse) {
    const endpoint = `${env.urlServices}${env.actualizarCashOutPath}`;
    return this._http.post<ResponseBusiness<RelacionCaja>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  actualizarRelacionCajatService(request: RelacionCaja) {
    const endpoint = `${env.urlServices}${env.actualizarRelacionCajaPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  lecturaZFinDiaService(request: LecturaCaja) {
    const endpoint = `${env.urlServices}${env.lecturaZFinDiaPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  lecturaZOfflineService(caja: number) {
    const endpoint = `${env.urlServices}${env.lecturaZOfflinePath}/${caja}`;
    return this._http.get<ResponseBusiness<LecturaTotalDetalleFormaPago[]>>(
      endpoint).map(res => res.data);
  }

  confirmaFinDeDia() {
    const endpoint = `${env.urlServices}${env.confimacionFinDia}`;
    return this._http.get<any>(
      endpoint).map(res => res.data);
  }

}

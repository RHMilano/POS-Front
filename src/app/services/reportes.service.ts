import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import {EstatusResult, ResponseBusiness} from '../Models/General/ResponseBusiness.model';
import {VentasDeptoRequest} from '../Models/Reportes/VentasDeptoRequest';
import {VentasDeptoResponse} from '../Models/Reportes/VentasDeptoResponse';
import {VentasSkuResponse} from "../Models/Reportes/VentasSkuResponse";
import {VentasCajaResponse} from "../Models/Reportes/VentasCajaResponse";
import {VentasDetalleResponse} from "../Models/Reportes/VentasDetalleResponse";
import {VentasHrResponse} from "../Models/Reportes/VentasHrResponse";
import {VentasSinDetalleResponse} from "../Models/Reportes/VentasSinDetalleResponse";
import {VentasVendedorResponse} from "../Models/Reportes/VentasVendedorResponse";
import {DevolucionesSkuResponse} from "../Models/Reportes/DevolucionesSkuResponse";
import {IngresosEgresos} from "../Models/Reportes/IngresosEgresos";
import {RelacionCaja} from '../Models/InicioFin/RelacionCaja';
import {ReporteRelacionCajaRequest} from '../Models/Reportes/ReporteRelacionCajaRequest';
import {reimpresionResponse} from '../Models/General/ReimpresionTicket.model';

@Injectable()
export class ReportesService {

  constructor(private _http: HttpClient) {
  }


  TotalVentasService(request: VentasDeptoRequest) {
    const endpoint = `${env.urlServices}${env.totalVentasPath}`;

    return this._http.post<ResponseBusiness<VentasDeptoResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  TotalVentasSkuService(request: VentasDeptoRequest) {
    const endpoint = `${env.urlServices}${env.ventasSkuPath}`;

    return this._http.post<ResponseBusiness<VentasSkuResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  TotalVentasCajaService(request: VentasDeptoRequest) {
    const endpoint = `${env.urlServices}${env.ventasCajaPath}`;

    return this._http.post<ResponseBusiness<VentasCajaResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  TotalVentasDetalleService(request: VentasDeptoRequest) {
    const endpoint = `${env.urlServices}${env.ventasDetallePath}`;

    return this._http.post<ResponseBusiness<VentasDetalleResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  TotalVentasHrService(request: VentasDeptoRequest) {
    const endpoint = `${env.urlServices}${env.ventasHrPath}`;

    return this._http.post<ResponseBusiness<VentasHrResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  TotalVentasSinDetalleService(request: VentasDeptoRequest) {
    const endpoint = `${env.urlServices}${env.ventasSinDetallePath}`;

    return this._http.post<ResponseBusiness<VentasSinDetalleResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  TotalVentasVendedorService(request: VentasDeptoRequest) {
    const endpoint = `${env.urlServices}${env.ventasVendedorPath}`;

    return this._http.post<ResponseBusiness<VentasVendedorResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  DevoplucionesSkuService(request: VentasDeptoRequest) {
    const endpoint = `${env.urlServices}${env.devolucionesSKUPath}`;

    return this._http.post<ResponseBusiness<DevolucionesSkuResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  IngresosEgresoService(request: VentasDeptoRequest) {
    const endpoint = `${env.urlServices}${env.ingresosEgresosPath}`;

    return this._http.post<ResponseBusiness<IngresosEgresos[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  RelacionCajaService(request: ReporteRelacionCajaRequest){
    const endpoint = `${env.urlServices}${env.reporteRelacionCajaPath}`;

    return this._http.post<ResponseBusiness<RelacionCaja[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  ReimprimirRelacionCajaService(folio: number) {
    const endpoint = `${env.urlServices}${env.reimprimirRelacionCajaPath}/${folio}`;
    return this._http.get<ResponseBusiness<EstatusResult>>(
      endpoint).map(res => res.data);
  }
}

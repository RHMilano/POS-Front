import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { ConfigGeneralesCajaTiendaResponse } from '../Models/General/ConfigGeneralesCajaTiendaResponse.model';
import { CompaniasResponse } from '../Models/General/Companias';
import { EstatusResult, ResponseBusiness } from '../Models/General/ResponseBusiness.model';
import { ProductsResponse } from '../Models/General/ProductsResponse.model';
import { ProductsRequest } from '../Models/ProductsRequest';
import { BusquedaAvanzadaRequest, BusquedaAvanzadaRespose, CatalogosRequest, CatalogosResponse } from '../Models/General/BusquedaAvanzada.model';
import { PagoServicioResponse } from '../Models/General/PagoServicioResponse';
import { DivisasRequest, DivisasResponse } from '../Models/General/DivisasRequest';
import { reimpresionResponse } from '../Models/General/ReimpresionTicket.model';
import { changePasswordRequest, changePasswordResponse } from '../Models/Security/ChangePassword';
import { TipoDivisasResponse } from '../Models/General/TipoDivisasResponse';
import {FinDiaResponse} from '../Models/InicioFin/FinDiaResponse';
import {CashOutResponse} from '../Models/InicioFin/CashOutResponse';
import { RetiroParcialEfectivoModel } from '../Models/General/RetiroParcialEfectivo.model';
import { OperationResponseModel } from '../Models/Sales/OperationResponse.model';
import { EgresoRequest } from '../Models/General/EgresoRequest';
import { DenominacionesModel } from '../Models/Pagos/DenominacionesModel';
import { LecturaCaja } from '../Models/General/LecturaCaja';
import { LecturaTotalDetalleFormaPago } from '../Models/General/LecturaTotalDetalleFormaPago';
import { InicioDiaResponse } from '../Models/InicioFin/InicioDiaResponse';
import { CapturaLuzRequest } from '../Models/InicioFin/CapturaLuzRequest';
import { AutenticacionOfflineRequest } from '../Models/InicioFin/AutenticacionOfflineRequest';
import {ObtenerFormasPagoRequest} from '../Models/General/ObtenerFormasPagoRequest';
import {ActualizacionSoftwareResponse} from '../Models/General/ActualizacionSoftwareResponse';
import {InformacionVersionSoftware} from '../Models/General/InformacionVersionSoftware';
import {EstatusActualizacionSoftwareResponse} from '../Models/General/EstatusActualizacionSoftwareResponse';

@Injectable()
export class GeneralService {

  constructor(private _http: HttpClient) {
  }

  ConfigGeneralesCajaTiendaService() {
    const endpoint = `${env.urlServices}${env.configGeneralesCajaTiendaPath}`;

    //OCG: Modificacion para enviar el numero de version de parches Milano
    //alert(JSON.stringify({"versionPOS":env.posversion}));

    return this._http.post<ResponseBusiness<ConfigGeneralesCajaTiendaResponse>>(
      endpoint, JSON.stringify({"versionPOS":env.posversion})).map(res => res.data);

  }

  ProductosService(request: ProductsRequest) {
    const endpoint = `${env.urlServices}${env.productoServicesPath}`;

    return this._http.post<ResponseBusiness<ProductsResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  TiempoAireService() {
    const endpoint = `${env.urlServices}${env.companiasPath}`;

    return this._http.get<ResponseBusiness<CompaniasResponse[]>>(
      endpoint).map(res => res.data);
  }

  MontosService(Codigo) {
    const endpoint = `${env.urlServices}${env.montosPath}` + Codigo;
    return this._http.get<ResponseBusiness<ProductsResponse[]>>(
      endpoint).map(res => res.data);
  }

  PagoServicioService() {
    const endpoint = `${env.urlServices}${env.serviciosPath}`;
    return this._http.get<ResponseBusiness<PagoServicioResponse[]>>(
      endpoint).map(res => res.data);
  }

  PagoServicioDetalleService(Codigo) {
    const endpoint = `${env.urlServices}${env.serviciosPath}` + Codigo;
    return this._http.get<ResponseBusiness<ProductsResponse[]>>(
      endpoint).map(res => res.data);
  }

  AdvancedSearchService(request: BusquedaAvanzadaRequest, sudoCredentials?: string) {
    const endpoint = `${env.urlServices}${env.busquedaAvanzadaPath}`;
    /**
     * Si el string de headers viene adjunta el header a la peticion
     * @type {{}}
     */
    const opts = {};
    let headers;
    if (sudoCredentials != '') {
      headers = new HttpHeaders().set('SUDO', sudoCredentials);
      opts['headers'] = headers;
    }
    return this._http.post<ResponseBusiness<BusquedaAvanzadaRespose>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }


  GetCatalogosService(request: CatalogosRequest, tipo: string) {
    let endpoint = `${env.urlServices}`;
    if (tipo === 'proveedor') {
      /**
       * Llamando servicio de proveedores por default
       */
      endpoint = endpoint + `${env.catProveedoresPath}`;
    } else if (tipo === 'departamento') {
      /**
       * Llamando servicios de departamentos
       */
      endpoint = endpoint + `${env.catDepartamentosPath}`;

    } else if (tipo === 'estilo') {

      endpoint = endpoint + `${env.catEstiloPath}/${request.proveedor}`;

    } else if (tipo === 'subdepartamento') {
      /**
       * Llamando servicios de subdepartamentos
       */
      endpoint = endpoint + `${env.catSubdepartamentosPath}` + '/' + request.departamento;

    } else if (tipo === 'clase') {
      /**
       * Llamando servicios de clases
       */
      endpoint = endpoint + `${env.catClasesPath}` + '/' + request.departamento + '/' + request.subdepartamento;

    } else if (tipo === 'subclase') {
      /**
       * Llamando servicios de clases
       */
      endpoint = endpoint + `${env.catSubclasesPath}` + '/' + request.departamento + '/' + request.subdepartamento + '/' + request.clase;

    }
    return this._http.get<ResponseBusiness<Array<CatalogosResponse>>>(endpoint).map(res => res.data);
  }

  AlmacenarImagenRemota(request: { url: string, avoidMsg?: boolean }) {
    //console.log(`AlmacenarImagenRemota: ${request.url}`);
    const endpoint = `${env.urlServices}${env.almacenarImagenRemotaPath}`;
    //console.log(`AlmacenarImagenRemota: ${endpoint}`);
    request.avoidMsg = true;
    return this._http.post<ResponseBusiness<any>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  GetTarjetaRegalo(tarjetaRegalo: string) {

    const endpoint = `${env.urlServices}${env.getTarjetaRegaloPath}/${tarjetaRegalo}`;
    return this._http.get<ResponseBusiness<ProductsResponse[]>>(
      endpoint).map(res => res.data);
  }

  DummySuperService() {
    // return Observable.of(true);

    const endpoint = `${env.urlServices}/Catalogs/FormaPagoService.svc/dummy`;
    return this._http.get<ResponseBusiness<any>>(endpoint).map(res => res.data);
  }

  getConvertirDivisa(divisasRequest: DivisasRequest) {
    const endpoint = `${env.urlServices}${env.getConvertirDivisaPath}`;
    return this._http.post<ResponseBusiness<DivisasResponse>>(
      endpoint, JSON.stringify(divisasRequest)).map(res => res);
  }

  //OCG Servicio para recuperar la autorizacion del servicio de punto clave
  VentaDolares(divisasRequest: DivisasRequest) {
    const endpoint = `${env.urlServices}${env.postVentaDolares}`;
    return this._http.post<ResponseBusiness<DivisasResponse>>(
      endpoint, JSON.stringify(divisasRequest)).map(res => res);
  }

  printTicket(folio: string) {
    const endpoint = `${env.urlServices}${env.reimprimirTicket}/${folio}`;
    return this._http.get<ResponseBusiness<reimpresionResponse>>(
      endpoint).map(res => res.data);
  }

  retiroParcialEfectivo (retiroParcialEfectivoRequest: RetiroParcialEfectivoModel) {
    const endpoint = `${env.urlServices}${env.retiroParcialEfectivoPath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(retiroParcialEfectivoRequest)).map(res => res.data);
  }

  getDenominaciones () {
    const endpoint = `${env.urlServices}${env.getDenominacionesPath}`;
    return this._http.post<ResponseBusiness<DenominacionesModel[]>>(
      endpoint, JSON.stringify({})).map(res => res.data);
  }

  lecturaX (request: ObtenerFormasPagoRequest) {
    const endpoint = `${env.urlServices}${env.lecturaXPath}`;
    return this._http.post<ResponseBusiness<LecturaTotalDetalleFormaPago[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  ejecutarArqueoCaja (arqueoCajaRequest: LecturaCaja) {
    const endpoint = `${env.urlServices}${env.ejecutarArqueoCajaPath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(arqueoCajaRequest)).map(res => res.data);
  }

  ejecutarCorteCaja (corteCajaRequest: LecturaCaja) {
    const endpoint = `${env.urlServices}${env.ejecutarCorteCajaPath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(corteCajaRequest)).map(res => res.data);
  }

  egreso (egresoRequest: EgresoRequest) {
    const endpoint = `${env.urlServices}${env.egresoPath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(egresoRequest)).map(res => res.data);
  }

  changePassword(changePasswordRequest: changePasswordRequest) {
    const endpoint = `${env.urlServices}${env.changePasswordPath}`;
    return this._http.post<ResponseBusiness<changePasswordResponse>>(
      endpoint, JSON.stringify(changePasswordRequest)).map(res => res.data);
  }

  getTipoDivisas() {
    const endpoint = `${env.urlServices}${env.getDivisasPath}`;
    return this._http.get<ResponseBusiness<TipoDivisasResponse[]>>(
      endpoint).map(res => res.data);
  }

  ignorarRetiroService() {
    const endpoint = `${env.urlServices}${env.ignorarRetiroPath}`;
    return this._http.get<ResponseBusiness<OperationResponseModel>>(
      endpoint).map(res => res.data);
  }

  autenticacionLecturaService(request: AutenticacionOfflineRequest) {
    const endpoint = `${env.urlServices}${env.autenticacionLecturaPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  comprobarVersionService() {
    const endpoint = `${env.urlUpdateVersion}${env.comprobarVersionPath}`;
    return this._http.get<ResponseBusiness<ActualizacionSoftwareResponse>>(
      endpoint).map(res => res.data);
  }

  actualizarVersionSoftwareService(request: Array<InformacionVersionSoftware>) {
    const endpoint = `${env.urlUpdateVersion}${env.actualizarVersionSoftwarePath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  estatusVersionSoftwareService() {
    const endpoint = `${env.urlUpdateVersion}${env.estatusVersionSoftwarePath}`;
    return this._http.get<ResponseBusiness<EstatusActualizacionSoftwareResponse>>(
      endpoint).map(res => res.data);
  }
}

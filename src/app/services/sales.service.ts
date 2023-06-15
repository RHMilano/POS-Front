import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,  HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { EmployeeRequest, EmployeeResponse } from '../Models/Sales/Employee';
import { EstatusResult, ResponseBusiness } from '../Models/General/ResponseBusiness.model';
import { ValidacionTARequest } from '../Models/Sales/ValidacionTA';
import { TotalizarVentaRequest } from '../Models/TotalizarVentaRequest';
import { TotalizarVentaResponseModel } from '../Models/Sales/TotalizarVentaResponse.model';
import { GetEmployeeMilanoResponseModel } from '../Models/Sales/GetEmployeeMilanoResponse.model';
import { FinalizarVentaRequest } from '../Models/Sales/FinalizarVentaRequest';
import { PagoEfectivoRequest, PagoEfectivoResponse, PagoValesRequest, PagoValesResponse } from '../Models/Pagos/Pagos.model';
import { ClienteRequest } from '../Models/Sales/ClienteRequest';
import { ClienteResponseModel } from '../Models/Sales/ClienteResponse.model';
import { GetMayoristaRequest } from '../Models/Sales/GetMayoristaRequest';
import { ReasonsCodesTransactionRequest } from '../Models/Sales/ReasonsCodesTransactionRequest';
import { ReasonsCodesTransactionResponseModel } from '../Models/Sales/ReasonsCodesTransactionResponse.model';
import { AnularTotalizarVentaRequest } from '../Models/Sales/AnularTotalizarVentaRequest';
import { AbonarApartadoRequest } from '../Models/Apartados/AbonarApartadoRequest';
import { BusquedaTransaccionResponse } from '../Models/Sales/BusquedaTransaccionResponse';
import { BusquedaTransaccionRequest } from '../Models/Sales/BusquedaTransaccionRequest';
import { VentaResponse } from '../Models/Sales/VentaResponse';
import { InformacionTCMMRequest } from '../Models/TCMM/InformacionTCMMRequest';
import { CrearApartadoRequest } from '../Models/Apartados/CrearApartadoRequest';
import { PlazosApartadoResponse } from '../Models/Apartados/PlazosApartadoResponse';
import { TotalizarApartadoRequest } from '../Models/Apartados/TotalizarApartadoRequest';
import { TotalizarApartadoResponseModel } from '../Models/Apartados/TotalizarApartadoResponse.model';
import { PostAnularVentaRequest } from '../Models/Sales/PostAnularVentaRequest';
import { FinalizarPagoTCMMRequest } from '../Models/TCMM/FinalizarPagoTCMMRequest';
import { MovimientoTarjetaRequest, MovimientoTarjetaResponse } from '../Models/Pagos/MovimientoTarjeta';
import {
  ProcesarMovimientoPagoVentaEmpleadoRequest,
  ProcesarMovimientoPagoVentaEmpleadoResponse
} from '../Models/Sales/ProcesarMovimientoPagoVentaEmpleado';
import { ProcesarMovimientoMayoristaRequest, ProcesarMovimientoMayoristaResponse } from '../Models/Sales/ProcesarMovimientoMayorista';
import {
  altaClienteFinalRequest,
  altaClienteFinalResponse,
  busquedaClienteFinalRequest,
  busquedaClienteFinalResponse
} from '../Models/Sales/ClienteFinalMayorista';
import { BusquedaApartadoRequest } from '../Models/Apartados/BusquedaApartadoRequest';
import { InformacionTCMMResponse } from '../Models/TCMM/InformacionTCMMResponse';
import { OperacionLineaTicketVentaResponse } from '../Models/Sales/OperacionLineaTicketVentaResponse';
import { LineaTicketModel } from '../Models/Sales/LineaTicket.model';
import { EliminarLineaTicket } from '../Models/Sales/EliminarLineaTicket';
import { SuspenderVentaRequest } from '../Models/Sales/SuspenderVentaRequest';
import { OperationResponseModel, WsPosResponseModel } from '../Models/Sales/OperationResponse.model';
import { AnularApartadoModel } from '../Models/Apartados/AnularApartado.model';
import { PagoServiciosOpcionesModel, PagoServiciosOpcionesResponse } from '../Models/Sales/PagoServiciosOpciones.model';
import { MovimientoTarjetaRegaloRequest, MovimientoTarjetaRegaloResponse } from '../Models/Sales/MovimientoTarjetaRegaloRequest';
import { CambiarPrecioRequest } from '../Models/Sales/CambiarPrecioRequest';
import { PlanesFinanciamientoRequest } from '../Models/Sales/PlanesFinanciamientoRequest';
import { PlanesFinanciamientoResponse } from '../Models/Sales/PlanesFinanciamientoResponse';
import { MovimientoTarjetaMMResponse } from '../Models/Pagos/MovimientoTarjetaMMResponse';
import { FinalizarPagoTCMM } from '../Models/Pagos/FinalizarPagoTCMM';
import { FinalizarPagoTCMMResponse } from '../Models/Pagos/FinalizarPagoTCMMResponse';
import { MercanciaRequest } from '../Models/Sales/MercanciaRequest';
import { MercanciaResponse } from '../Models/Sales/MercanciaResponse';
import { BusquedaApartadosResponse } from '../Models/Apartados/BusquedaApartadosResponse';
import { AltaClientesResponse } from '../Models/Apartados/AltaClientesResponse.model';
import { FormaPagoResponse } from '../Models/Pagos/FormaPagoResponse';
import { CabeceraVentaRequest } from '../Models/Sales/CabeceraVentaRequest';
import { VentaResponseModel } from '../Models/Sales/VentaResponse.model';
import { DevolverArticuloRequest } from '../Models/Sales/DevolverArticuloRequest';
import { GetMayoristaMilanoResponseModel } from '../Models/Sales/GetMayoristaMilanoResponse.model';
import { MovimientoNotaCreditoRequest } from '../Models/Pagos/MovimientoNotaCreditoRequest';
import { ValidaValeResponse } from '../Models/Pagos/ValidaValeResponse';
import { ValidaValeRequest } from '../Models/Pagos/ValidaValeRequest';
import { ConsultaClienteFinLag } from '../Models/Pagos/ConsultaClienteFinLag';
import { ConsultaClienteResponse } from '../Models/Pagos/ConsultaClienteResponse';
import { TablaAmortizacionResponse } from '../Models/Pagos/TablaAmortizacionResponse';
import { TablaAmortizacionRequest } from '../Models/Pagos/TablaAmortizacionRequest';
import { AplicaValeRequest } from '../Models/Pagos/AplicaValeRequest';
import { RedencionCuponesRequest } from '../Models/Pagos/RedencionCuponesRequest';
import { RedencionCuponesResponse } from '../Models/Pagos/RedencionCuponesResponse';
import { ProcesarMovimientoPagoPinPadMovilRequest } from '../Models/Pagos/ProcesarMovimientoPagoPinPadMovilRequest';
import { SolicitudAutorizacionDescuentoRequest } from '../Models/Sales/SolicitudAutorizacionDescuentoRequest';
import { SolicitudAutorizacionDescuentoResponse } from '../Models/Sales/SolicitudAutorizacionDescuentoResponse';
import { RequestOptions } from '@angular/http/src/base_request_options';
import { Observable } from 'rxjs';// OCG: Observable
import { AutorizaCancelacionRequestModel } from '../Models/Sales/AutorizaCancelacionRequest';
import { AutorizaCancelacionResponseModel } from '../Models/Sales/AutorizaCancelacionResponse';
import { PagoWebxComponent } from '../layout/pago-webx/pago-webx.component';
import { PagoWebxResponse } from '../Models/Sales/PagoWebx';
import { ConfiguracionMSIResponse } from '../Models/BBVAv2/ConfiguracionMsiResponse';
import { CardData } from '../Models/BBVAv2/CardData';
import { RedencionPuntosLealtadComponent } from '../layout/formas-pago-menu/redencion-puntos-lealtad/redencion-puntos-lealtad.component';
import { RedencionPuntosLealtadResponse, RendencionPuntosLealtadRequest } from '../Models/Pagos/RedencionPuntosLealtad';


@Injectable()
export class SalesService {

  constructor(private _http: HttpClient) {
  }

  EmployeeService(request: EmployeeRequest) {
    const endpoint = `${env.urlServices}${env.employeePath}`;

    return this._http.post<ResponseBusiness<EmployeeResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  FraudValidationService(request: ValidacionTARequest) {

    const endpoint = `${env.urlServices}${env.validacionTAPath}`;

    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  TotalizarVentaService(request: TotalizarVentaRequest) {
    const endpoint = `${env.urlServices}${env.totalizarVentaPath}`;
    //debugger;
    return this._http.post<ResponseBusiness<TotalizarVentaResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  CerrarDevolucion(request: TotalizarVentaRequest) {
    const endpoint = `${env.urlServices}${env.cerrarDevolucionPath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  TotalizarApartadoService(request: TotalizarApartadoRequest) {
    const endpoint = `${env.urlServices}${env.totalizarApartadoPath}`;
    return this._http.post<ResponseBusiness<TotalizarApartadoResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  ValidaDiaVentaEmpleado() {
    const endpoint = `${env.urlServices}${env.validaVentaEmpleadoPath}`;
    return this._http.get<ResponseBusiness<EstatusResult>>(endpoint).map(res => Number(res.data.codeNumber) === 335);
  }

  GetEmployeeMilano(employee: number, storeCode: number, caja: number) {
    const endpoint = `${env.urlServices}${env.getEmployeeMilanoPath}/${employee}/${storeCode}/${caja}`;
    return this._http.get<ResponseBusiness<GetEmployeeMilanoResponseModel>>(endpoint).map(res => res.data);
  }

  FinalizarVentaService(request: FinalizarVentaRequest) {
    
    //console.log(JSON.stringify(request));
    
    //debugger
    //delete request['informacionMayorista'];
    //delete request['lineasTiempoAire'];
    // OCG Finalizar venta

    let z: number;
    let _i: number;

    // Validar si la linea viene con datos en el digito verificador
    if ( request.lineasConDigitoVerificadorIncorrecto) {

      z  =  request.lineasConDigitoVerificadorIncorrecto.length;

      for (_i = 0; _i < (z - 1); _i++) {

        if (request.lineasConDigitoVerificadorIncorrecto[_i]) {

          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['impuesto1'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['impuesto2'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['precioCambiadoImpuesto1'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['precioCambiadoImpuesto2'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['tasaImpuesto1'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['tasaImpuesto2'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['precioConImpuestos'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['precioCambiadoConImpuestos'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['codigoImpuesto1'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['codigoImpuesto2'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['precioConImpuestos'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['precioCambiadoConImpuestos'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['upc'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['estilo'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['rutaImagenLocal'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['rutaImagenRemota'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['clase'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['codigoClase'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['codigoDepto'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['codigoSubClase'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['codigoSubDepto'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['depto'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['skuCompania'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['subClase'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['subDepartamento'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['codigoMarca'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['esTarjetaRegalo'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i].articulo['informacionPagoTCMM'];
  
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['cantidadDevuelta'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeDevolucionLineaNeto'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeDevolucionLineaBruto'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeDevolucionLineaDescuentos'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeDevolucionLineaImpuestos'];
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['cantidadVendida']
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeVentaLineaNeto']
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeVentaLineaImpuestos1']
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeVentaLineaBruto']
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeVentaLineaImpuestos2']
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['descuentoDirectoLinea']
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeVentaLineaDescuentos']
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['codigoTipoDetalleVenta']
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['importeVentaLineaImpuestos2']
          delete request.lineasConDigitoVerificadorIncorrecto[_i]['perteneceVentaOriginal']
  
          request.lineasConDigitoVerificadorIncorrecto[_i].articulo.informacionTarjetaRegalo = null;
          request.lineasConDigitoVerificadorIncorrecto[_i].articulo.informacionProveedorExternoAsociadaPS = null;
          request.lineasConDigitoVerificadorIncorrecto[_i].articulo.informacionProveedorExternoTA = null;
          request.lineasConDigitoVerificadorIncorrecto[_i].cabeceraVentaAsociada = null;
  
        }
      }

    } 

    const endpoint = `${env.urlServices}${env.finalizarVentaPath}`;
    //console.log(request);
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  PagoEfectivoService(request: PagoEfectivoRequest) {
    const endpoint = `${env.urlServices}${env.pagoEfectivoPath}`;
    return this._http.post<ResponseBusiness<PagoEfectivoResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  AnularPagoEfectivoService(request: PagoEfectivoRequest) {
    const endpoint = `${env.urlServices}${env.anularEfectivoPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }


  PagoValesService(request: PagoValesRequest) {
    const endpoint = `${env.urlServices}${env.pagoValesPath}`;
    return this._http.post<ResponseBusiness<PagoValesResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  ClienteService(request: ClienteRequest) {
    const endpoint = `${env.urlServices}${env.clienteRequestPath}`;
    return this._http.post<ResponseBusiness<Array<ClienteResponseModel>>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  ClienteModificaService(request: ClienteRequest) {
    const endpoint = `${env.urlServices}${env.clienteModificaPath}`;
    return this._http.post<ResponseBusiness<AltaClientesResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  MayoristaService(request: GetMayoristaRequest) {
    const endpoint = `${env.urlServices}${env.mayoristaRequestPath}`;
    /*
        return Observable.of([{
          calle: 'abcabc',
          ciudad: 'abcsdfa',
          codigoPostal: 9300,
          codigoTienda: 3,
          colonia: 1234,
          creditoDisponible: 5000,
          error: '',
          estado: 'edo mexico',
          estatus: 'true,',
          fechaUltimoPago: 'sadfasfa',
          limiteCredito: 10000,
          mensaje: '',
          municipio: 'qeqweqww',
          nombre: 'señor x',
          numeroExterior: 'abc',
          numeroInterior: 'abc',
          pagosPeriodoActual: 200,
          porcentajeComision: 15,
          rfc: 'LOSG840307',
          saldo: 2500,
          telefono: '5521212121',
          codigoMayorista: 1,
          saldoActual: 2500,
          estadoCuentaMayorista: {
            anio: 2018,
            compras: 400,
            creditoDisponible: 5000,
            existe: true,
            fechaCorte: 'today',
            fechaFinal: 'today',
            fechaInicial: 'today',
            fechaLimitePago: 'today',
            limiteCredito: 10000,
            notasDeCargo: 0,
            notasDeCredito: 0,
            numeroAtrasos: 0,
            pagoMinimo: 100,
            pagoQuincenal: 500,
            pagoVencido: 600,
            pagos: 10,
            periodo: 10,
            saldoActual: 2500,
            saldoAnterior: 2500
          }
        }]);
    */
    return this._http.post<ResponseBusiness<GetMayoristaMilanoResponseModel[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);

  }

  MayoristaDetalleService(request: GetMayoristaRequest) {
    const endpoint = `${env.urlServices}${env.mayoristaDetalleRequestPath}`;

    /*
        return Observable.of({
          calle: 'abcabc',
          ciudad: 'abcsdfa',
          codigoPostal: 9300,
          codigoTienda: 3,
          colonia: 1234,
          creditoDisponible: 5000,
          error: '',
          estado: 'edo mexico',
          estatus: 'true,',
          fechaUltimoPago: 'sadfasfa',
          limiteCredito: 10000,
          mensaje: '',
          municipio: 'qeqweqww',
          nombre: 'señor x',
          numeroExterior: 'abc',
          numeroInterior: 'abc',
          pagosPeriodoActual: 200,
          porcentajeComision: 15,
          rfc: 'LOSG840307',
          saldo: 2500,
          telefono: '5521212121',
          codigoMayorista: 1,
          saldoActual: 2500,
          estadoCuentaMayorista: {
            anio: 2018,
            compras: 400,
            creditoDisponible: 5000,
            existe: true,
            fechaCorte: 'today',
            fechaFinal: 'today',
            fechaInicial: 'today',
            fechaLimitePago: 'today',
            limiteCredito: 10000,
            notasDeCargo: 0,
            notasDeCredito: 0,
            numeroAtrasos: 0,
            pagoMinimo: 100,
            pagoQuincenal: 500,
            pagoVencido: 600,
            pagos: 10,
            periodo: 10,
            saldoActual: 2500,
            saldoAnterior: 2500
          }
        });


        */

    return this._http.post<ResponseBusiness<GetMayoristaMilanoResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);

  }

  ReasonsCodesTransactionService(request: ReasonsCodesTransactionRequest) {
    const endpoint = `${env.urlServices}${env.cancelarPath}`;
    return this._http.post<ResponseBusiness<ReasonsCodesTransactionResponseModel[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  AnularTotalizarVentaService(request: AnularTotalizarVentaRequest) {
    const endpoint = `${env.urlServices}${env.anularTransaccionPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  AbonarApartadoService(request: AbonarApartadoRequest) {
    const endpoint = `${env.urlServices}${env.abonoApartadoPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  CancelarApartadoService(Folio) {
    const endpoint = `${env.urlServices}${env.cancelacionApartadoPath}` + Folio;
    return this._http.get<ResponseBusiness<EstatusResult>>(
      endpoint).map(res => res.data);
  }

  PlazosApartadoService() {
    const endpoint = `${env.urlServices}${env.plazosApartadoPath}`;
    return this._http.get<ResponseBusiness<PlazosApartadoResponse[]>>(
      endpoint).map(res => res);
  }

  CrearApartadoService(request: CrearApartadoRequest) {
    const endpoint = `${env.urlServices}${env.crearApartadoPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  BusquedaApartadoService(request: BusquedaApartadoRequest) {
    const endpoint = `${env.urlServices}${env.busquedaApartadoPath}`;
    return this._http.post<ResponseBusiness<BusquedaApartadosResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  BusquedaTransaccionService(request: BusquedaTransaccionRequest) {
    const endpoint = `${env.urlServices}${env.buscarTransaccionPath}`;
    return this._http.post<ResponseBusiness<BusquedaTransaccionResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  SuspenderVentaService(request: SuspenderVentaRequest) {
    const endpoint = `${env.urlServices}${env.suspenderTransaccionPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  getVentaService(Folio) {
    const endpoint = `${env.urlServices}${env.getVentaPath}` + Folio;
    return this._http.get<ResponseBusiness<VentaResponse>>(
      endpoint).map(res => res.data);
  }

  ConsultaSaldoMMService(request: InformacionTCMMRequest) {
    //alert(JSON.stringify(request));
    const endpoint = `${env.urlServices}${env.consultaSaldoMMPath}`;
    return this._http.post<ResponseBusiness<InformacionTCMMResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  PostAnularService(request: PostAnularVentaRequest) {
    const endpoint = `${env.urlServices}${env.postAnularVentaPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  finalizarPagoTCMM(request: FinalizarPagoTCMMRequest) {
    const endpoint = `${env.urlServices}${env.finalizarPagoTCMMPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarMovimientoTarjetaRegalo(request: MovimientoTarjetaRegaloRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoTarjetaRegaloPath}`;
    return this._http.post<ResponseBusiness<MovimientoTarjetaRegaloResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarMovimientoNotaCredito(request: MovimientoNotaCreditoRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoNotaCreditoPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarMovimientoPagoPinPadMovil(request: ProcesarMovimientoPagoPinPadMovilRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoPagoPinPadMovilPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  // OCG: Servicio para el pago de transferencia
  procesarMovimientoPagoTransferencia(request: ProcesarMovimientoPagoPinPadMovilRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoPagoTransferenciaPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }



  procesarMovimientoPagoVentaEmpleado(request: ProcesarMovimientoPagoVentaEmpleadoRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoPagoVentaEmpleadoPath}`;
    return this._http.post<ResponseBusiness<ProcesarMovimientoPagoVentaEmpleadoResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarMovimientoTarjetaBancariaAmericanExpress(request: MovimientoTarjetaRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoPagoTarjetaPath}`;
    return this._http.post<ResponseBusiness<MovimientoTarjetaResponse>>(
      endpoint, JSON.stringify(request), { headers: new HttpHeaders({ timeout: `${360000}` }) }).map(res => res.data);
  }

  // OCG: llamada inicial para pagar con tarjeta
  procesarMovimientoPagoTarjetaVisaMaster(request: MovimientoTarjetaRequest) {
    //debugger;
    const endpoint = `${env.urlServices}${env.procesarMovimientoPagoTarjetaVisaMasterPath}`;
    return this._http.post<ResponseBusiness<MovimientoTarjetaResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  /*OCG: Se le envían los datos del ticket y la partida que se pago con TCMM
  para que se quede registrado ese pago.
  Nota: No finaliza la venta*/
  procesarMovimientoPagoTarjetaMM(request: FinalizarPagoTCMM) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoTarjetaMM}`;
    //console.log(`...request: ${JSON.stringify(request)}`);
    return this._http.post<ResponseBusiness<FinalizarPagoTCMMResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  obtenerTarjetaMM(request: MovimientoTarjetaRequest) {
    const endpoint = `${env.urlServices}${env.obtenerTarjetaMM}`;
    return this._http.post<ResponseBusiness<MovimientoTarjetaMMResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarMovimientoTarjetaBancariaCashBack(request: MovimientoTarjetaRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoTarjetaBancariaCashBack}`;
    return this._http.post<ResponseBusiness<MovimientoTarjetaResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarMovimientoTarjetaBancariaCashBackAdvance(request: MovimientoTarjetaRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoTarjetaBancariaCashBackAdvance}`;
    return this._http.post<ResponseBusiness<MovimientoTarjetaResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarMovimientoTarjetaBancariaConPuntos(request: MovimientoTarjetaRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoTarjetaBancariaConPuntos}`;
    return this._http.post<ResponseBusiness<MovimientoTarjetaResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarMovimientoTarjetaBancariaCancelar(request: MovimientoTarjetaRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoTarjetaBancariaCancelar}`;
    return this._http.post<ResponseBusiness<MovimientoTarjetaResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarRedencionPuntosLealtad(request: RendencionPuntosLealtadRequest) {
    const endpoint = `${env.urlServices}${env.postRedencionPuntosLealtad}`;
    return this._http.post<ResponseBusiness<RedencionPuntosLealtadResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  procesarMovimientoMayorista(request: ProcesarMovimientoMayoristaRequest) {
    const endpoint = `${env.urlServices}${env.procesarMovimientoMayoristaPath}`;
    return this._http.post<ResponseBusiness<ProcesarMovimientoMayoristaResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  busquedaClienteFinal(request: busquedaClienteFinalRequest) {
    const endpoint = `${env.urlServices}${env.busquedaClienteFinalPath}`;
    return this._http.post<ResponseBusiness<Array<busquedaClienteFinalResponse>>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  altaClienteFinal(request: altaClienteFinalRequest) {
    const endpoint = `${env.urlServices}${env.altaClienteFinalPath}`;
    return this._http.post<ResponseBusiness<altaClienteFinalResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  agregarLineaTicketVenta(request: LineaTicketModel, isApartado: boolean) {
    const servicePath = isApartado ? env.agregarLineaTicketApartado : env.agregarLineaTicketVenta;
    const endpoint = `${env.urlServices}${servicePath}`;
    return this._http.post<ResponseBusiness<OperacionLineaTicketVentaResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  cambiarPiezasLineaTicketVenta(request: LineaTicketModel, isApartado: boolean) {
    const servicePath = isApartado ? env.cambiarPiezasLineaTicketApartado : env.cambiarPiezasLineaTicketVenta;
    const endpoint = `${env.urlServices}${servicePath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  eliminarLineaTicketVenta(request: EliminarLineaTicket, isApartado: boolean) {
    const servicePath = isApartado ? env.eliminarLineaTicketApartado : env.eliminarLineaTicketVenta;
    const endpoint = `${env.urlServices}${servicePath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  cambiarPrecioLineaTicketVenta(request: CambiarPrecioRequest, isApartado: boolean) {
    const servicePath = isApartado ? env.cambiarPrecioLineaTicketApartado : env.cambiarPrecioLineaTicketVenta;
    const endpoint = `${env.urlServices}${servicePath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  descuentoDirectoVenta(request: LineaTicketModel) {
    const endpoint = `${env.urlServices}${env.descuentoDirectoVenta}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  anularApartado(request: AnularApartadoModel) {
    const endpoint = `${env.urlServices}${env.anularApartado}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  pagoServiciosOpciones(request: PagoServiciosOpcionesModel) {
    const endpoint = `${env.urlServices}${env.pagoServiciosOpciones}`;
    return this._http.post<ResponseBusiness<PagoServiciosOpcionesResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  // OCG: Obtiene el esquema de financiamiento de le TCMM
  planesFinanciamientoService(request: PlanesFinanciamientoRequest) {
    const endpoint = `${env.urlServices}${env.planesFinanciamiento}`;
    return this._http.post<ResponseBusiness<PlanesFinanciamientoResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  mercanciaDaniadaService(request: MercanciaRequest) {
    const endpoint = `${env.urlServices}${env.mercanciaDaniadaPath}`;
    return this._http.post<ResponseBusiness<MercanciaResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  picosMercanciaService(request: MercanciaRequest) {
    const endpoint = `${env.urlServices}${env.picosMercanciaPath}`;
    return this._http.post<ResponseBusiness<MercanciaResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  getValesService() {
    const endpoint = `${env.urlServices}${env.getValesPath}`;
    return this._http.get<ResponseBusiness<FormaPagoResponse[]>>(
      endpoint).map(res => res.data);
  }

  eliminarLineaMayorista(request: CabeceraVentaRequest) {
    const endpoint = `${env.urlServices}${env.eliminarLineaMayorista}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  validarDevolucion(folio: string) {
    const endpoint = `${env.urlServices}${env.validarDevolucionPatch}${folio}`;
    return this._http.get<ResponseBusiness<VentaResponseModel>>(
      endpoint).map(res => res.data);
  }

  cambiarPiezasArticuloLineaTicketDevolucion(request: DevolverArticuloRequest) {
    const endpoint = `${env.urlServices}${env.cambiarPiezasArticuloLineaTicketDevolucionPath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  cargarLlaves() {
    const endpoint = `${env.urlServices}${env.cargarLlavesPath}`;
    return this._http.get<ResponseBusiness<OperationResponseModel>>(
      endpoint).map(res => res.data);
  }

  validaValeService(request: ValidaValeRequest) {
    const endpoint = `${env.urlServices}${env.validaValePath}`;
    return this._http.post<ResponseBusiness<ValidaValeResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  consultaClienteFinLagService(request: ConsultaClienteFinLag) {
    const endpoint = `${env.urlServices}${env.consultaClienteFinLagPath}`;
    return this._http.post<ResponseBusiness<ConsultaClienteResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  tablaAmortizacionService(request: TablaAmortizacionRequest) {
    const endpoint = `${env.urlServices}${env.tablaAmortizacionPath}`;
    return this._http.post<ResponseBusiness<TablaAmortizacionResponse[]>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  aplicarValeService(request: AplicaValeRequest) {
    const endpoint = `${env.urlServices}${env.aplicarValePath}`;
    return this._http.post<ResponseBusiness<OperationResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  redencionCuponesService(request: RedencionCuponesRequest) {
    const endpoint = `${env.urlServices}${env.redencionCuponesPath}`;
    return this._http.post<ResponseBusiness<RedencionCuponesResponse>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  //OCG Enviar correo de autorizacion 
  solicitudAutorizacionDescuentoService(request: SolicitudAutorizacionDescuentoRequest) {
    const ENDPOINT = `${env.urlServices}${env.solicitudDescuentoPath}`;
    return this._http.post<ResponseBusiness<SolicitudAutorizacionDescuentoResponse>>(
      ENDPOINT, JSON.stringify(request)).map(res => res.data);
  }

  autorizaCancelacionService(request: AutorizaCancelacionRequestModel) {
    const endpoint = `${env.urlServices}${env.autorizaCancelacionTransaccion}`;
    return this._http.post<ResponseBusiness<AutorizaCancelacionResponseModel>>(
      endpoint, JSON.stringify(request)).map(res => res.data);
  }

  //OCG: Consultar en la API de Crédito si ya se pago 
  verificarPagoWeb(folio:string){
    return this._http.get<ResponseBusiness<PagoWebxResponse>>(`${env.urlServices}${env.verificarPagoWeb}${ folio }`).map(res => res.data);
  }



} 

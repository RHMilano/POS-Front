import { ElementRef, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TicketVirtual } from '../../layout/ticket-virtual/TicketVirtual';
import { FlujoBloqueo, TipoVenta } from '../../shared/GLOBAL';
import { Employee } from '../Sales/Employee';
import { ClienteResponseModel } from '../Sales/ClienteResponse.model';
import { SuspenderVentaRequest } from '../Sales/SuspenderVentaRequest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PagoTCMM } from '../Pagos/PagoTCMM';
import { GetMayoristaMilanoResponseModel } from '../Sales/GetMayoristaMilanoResponse.model';
import { UserResponse } from '../Security/User.model';
import { TotalizarVentaResponseModel } from '../Sales/TotalizarVentaResponse.model';
import { GeneralService } from '../../services/general.service';
import { AlertService } from '../../services/alert.service';
import { SalesService } from '../../services/sales.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { MsgService } from '../../services/msg.service';
import { ConfigPosService } from '../../services/config-pos.service';
import { AuthService } from '../../services/auth.service';
import { CargaVentaResponseService } from '../../services/carga-venta-response.service';
import { TotalizarApartadoResponseModel } from '../Apartados/TotalizarApartadoResponse.model';
import { TotalizarApartadoModel } from '../Apartados/TotalizarApartado.model';
import { TotalizarVentaModel } from '../Sales/TotalizarVenta.model';
import { PagoApartado } from '../Apartados/PagoApartado';
import { SudoCallbackFactory } from '../General/SudoCallbackFactory';
import { ProductsResponse } from '../General/ProductsResponse.model';
import { TicketRow } from '../../layout/ticket-virtual/TicketRow';
import { BotoneraPeticion } from '../General/Funciones.model';
import { VentaResponseModel } from '../Sales/VentaResponse.model';
import { CambiarPrecioRequest } from '../Sales/CambiarPrecioRequest';
import { LineaTicket } from '../Sales/LineaTicket';
import { EliminarLineaTicket } from '../Sales/EliminarLineaTicket';
import { Descuento } from '../Sales/Descuento.model';
import { FormasDePagoComponentInterface } from './FormasDePagoComponentInterface';
import { DevolverArticuloRequestModel } from '../Sales/DevolverArticuloRequest.model';


export interface TicketVirtualComponentInterface {
  cambioPrecioTmpl: TemplateRef<any>;
  suspenderTemplate: TemplateRef<any>;
  skuInput: ElementRef;
  modalRef: BsModalRef;
  sku: string;
  ticketVirtual: TicketVirtual;
  currentSelection: number;
  realizarPago: boolean;
  tipoVenta: TipoVenta;
  empleadoVendedorSeleccionado: Employee;
  selectedClienteApartado: ClienteResponseModel;
  dataTransferSub: any;
  totalizaSub: any;
  empleadoVendedorSub: any;
  apartadoTicketSub: any;
  applyDiscountSub: any;
  applyDiscountTxSub: any;
  authSub: any;
  suspenderSub: any;
  suspenderRequest: SuspenderVentaRequest;
  articuloAgregado: boolean;
  tipoBusqueda: any;
  $articuloAgregado: BehaviorSubject<boolean>;
  articuloAgregadoMainSub: any;
  isPagoTcmm: boolean;
  isPagoMayorista: boolean;
  PagoTcmmData: PagoTCMM;
  FormasPagoInstance: FormasDePagoComponentInterface;
  secueciaApartado: number;
  cargaVentaResponseSub: any;
  mayoristaInfoPagoCredito: GetMayoristaMilanoResponseModel;
  isBuscandoSku: boolean;
  isModoDevolucion: boolean;
  loggedInfo: UserResponse;
  totalizarResponse: TotalizarVentaResponseModel;
  _generalService: GeneralService;
  _alertService: AlertService;
  _salesService: SalesService;
  _dataTransfer: DataTransferService;
  _msgService: MsgService;
  _modalService: BsModalService;
  _configService: ConfigPosService;
  _authService: AuthService;
  _cargaVentaService: CargaVentaResponseService;
  _TotalizarApartadoResponse: TotalizarApartadoResponseModel;
  readonly TotalizarApartadoResponse: TotalizarApartadoResponseModel;
  _TotalizarApartadoRequest: TotalizarApartadoModel;
  readonly TotalizarApartadoRequest: TotalizarApartadoModel;
  _realizarApartado: boolean;
  readonly realizarApartado: boolean;
  _TotalizarRequest: TotalizarVentaModel;
  readonly TotalizarRequest: TotalizarVentaModel;
  readonly TotalizarVentaResponse: TotalizarVentaResponseModel;
  _pagoApartado: PagoApartado;
  readonly pagoApartado: PagoApartado;

  ngOnDestroy(): void;

  ngAfterViewInit(): void;

  ngOnInit(): void;

  bloqueoBotonesAfterBotonera(): void;

  seleccionaVendedor(): void;

  resetTicket(): void;

  cancelarTicket(saltarRazones?: boolean, doLogout?: boolean): void;

  ingresaRazonCancelacion(doLogout?: boolean): void;

  returnTicket(): void;

  declineCancelarTicket(): void;

  skuOnEnter(): void;

  ProductosServiceNext(response: Array<ProductsResponse>): Promise<any>;

  setInfoAfterAgregar(ticketRow: TicketRow): void;

  clearSeachField(): void;

  suspenderModal(): void;

  suspenderTransaccion(): void;

  totalizar(): void;

  createBaseTotalizarApartadoRequest(request: TotalizarApartadoModel): TotalizarApartadoModel;

  getSelectedItem(selectedItem: {
    item: TicketRow, index: number
  }): void;

  sudoCambiarPrecioArticulo(): SudoCallbackFactory;

  addArticuloExterno(articuloExterno: ProductsResponse | Array<ProductsResponse>): void;

  cargaVentaResponse(venta: VentaResponseModel): void;

  bloqueaBotones(flujoBloqueo?: FlujoBloqueo, items?: Array<BotoneraPeticion>): void;

  aceptarCambioPrecio(newPrice: number, codigoRazon: number): void;

  resetSeleccion(): void;

  seleccionarClienteApartado(): void;

  setClienteApartado(cliente: ClienteResponseModel): void;

  getSeletedItem(): TicketRow;

  setFormasPagoInstance(instance): void;

  sendPagoMayorista(mayoristaInfo: GetMayoristaMilanoResponseModel, lineaTicket: Array<ProductsResponse>): void;

  sendLineaTicket(lineaTicket: LineaTicket): Promise<any>;

  sendCambioPiezasLineaTicketDevolucion(devolverRequest: DevolverArticuloRequestModel): Promise<any>;

  sendCambioPiezasLineaTicket(lineaTicket: LineaTicket): Promise<any>;

  sendCambioPrecioLineaTicket(cambiaPrecioRequest: CambiarPrecioRequest): Promise<any>;

  sendEliminarLineaTicket(eliminarLinea: EliminarLineaTicket): Promise<any>;

  sendDescuentoLineaTicket(lineaTicket: LineaTicket): Promise<any>;

  initCabeceraVenta(): void;

  sendPagoTCMM(pagoTcmm: PagoTCMM, lineaTicket: Array<ProductsResponse>): void;

  sendPagoWeb(lineaTicket: Array<ProductsResponse>): void; // OCG: Definición de interface para pago web

  setTicketTotalizado(isTotalizado: boolean): void;

  sendTotalizarRequest(): void;

  sendTotalizarApartadoRequest(): void;

  cambiaPrecioArticulo(): void;

  applyDescuento(descuento: Descuento): void;

  applyDescuentoTx(descuento: Array<Descuento>): void;

  focusOnSkuInput(): void;

  showFormasPagoTotalizar(): void;
}

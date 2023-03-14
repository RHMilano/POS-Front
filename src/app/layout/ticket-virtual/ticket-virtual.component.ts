import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProductsRequest } from '../../Models/ProductsRequest';
import { GeneralService } from '../../services/general.service';
import { TicketVirtual } from './TicketVirtual';
import {FlujoBloqueo, PagosOps, TipoCabeceraTotalizar, TipoDescuento, TiposProductos, TipoVenta} from '../../shared/GLOBAL';
import { ProductsResponse } from '../../Models/General/ProductsResponse.model';
import { TicketRow } from './TicketRow';
import { AlertService } from '../../services/alert.service';
import { SalesService } from '../../services/sales.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { MsgService } from '../../services/msg.service';
import { Employee } from '../../Models/Sales/Employee';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TotalizarVentaResponseModel } from '../../Models/Sales/TotalizarVentaResponse.model';
import { BotoneraPeticion, Botones } from '../../Models/General/Funciones.model';
import { SudoCallbackFactory } from '../../Models/General/SudoCallbackFactory';
import { ConfigPosService } from '../../services/config-pos.service';
import { ClienteResponseModel } from '../../Models/Sales/ClienteResponse.model';
import { Descuento } from '../../Models/Sales/Descuento.model';
import { TotalizarApartadoModel } from '../../Models/Apartados/TotalizarApartado.model';
import { TotalizarVentaModel } from '../../Models/Sales/TotalizarVenta.model';
import { TotalizarVentaRequest } from '../../Models/TotalizarVentaRequest';
import { TotalizarApartadoRequest } from '../../Models/Apartados/TotalizarApartadoRequest';
import { TotalizarApartadoResponseModel } from '../../Models/Apartados/TotalizarApartadoResponse.model';
import { PagoTCMM } from '../../Models/Pagos/PagoTCMM';
import { BusquedaClienteComponent } from '../busqueda-cliente/busqueda-cliente.component';
import { PagoApartado } from '../../Models/Apartados/PagoApartado';
import { CancelarTransaccionComponent } from '../cancelar-transaccion/cancelar-transaccion.component';
import { RazonesCancelacionComponent } from '../razones-cancelacion/razones-cancelacion.component';
import { CambioDePrecioComponent } from '../cambio-de-precio/cambio-de-precio.component';
import { UserResponse } from '../../Models/Security/User.model';
import { AuthService } from '../../services/auth.service';
import { LineaTicket } from '../../Models/Sales/LineaTicket';
import { EliminarLineaTicket } from '../../Models/Sales/EliminarLineaTicket';
import { SuspenderVentaRequest } from '../../Models/Sales/SuspenderVentaRequest';
import { VentaResponseModel } from '../../Models/Sales/VentaResponse.model';
import { CabeceraApartadosRequest } from '../../Models/Apartados/CabeceraApartadosRequest';
import { CargaVentaResponseService } from '../../services/carga-venta-response.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CambiarPrecioRequest } from '../../Models/Sales/CambiarPrecioRequest';
import { GetMayoristaMilanoResponseModel } from '../../Models/Sales/GetMayoristaMilanoResponse.model';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { FormasDePagoComponentInterface } from '../../Models/FrontEnd/FormasDePagoComponentInterface';
import { OperacionLineaTicketVentaResponse } from '../../Models/Sales/OperacionLineaTicketVentaResponse';
import { RowSelectorInterface } from '../../Models/FrontEnd/RowSelectorInterface';
import { DevolverArticuloRequest } from '../../Models/Sales/DevolverArticuloRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-virtual',
  templateUrl: './ticket-virtual.component.html',
  styleUrls: ['./ticket-virtual.component.css'],
  providers: [GeneralService, SalesService]
})
export class TicketVirtualComponent implements OnInit, AfterViewInit, OnDestroy, TicketVirtualComponentInterface, RowSelectorInterface {

  @ViewChild('cambioPrecioTemplate') cambioPrecioTmpl: TemplateRef<any>;
  @ViewChild('suspenderTemplate') suspenderTemplate: TemplateRef<any>;
  @ViewChild('skuInput') skuInput: ElementRef;
  modalRef: BsModalRef;
  sku: string;
  ticketVirtual: TicketVirtual = new TicketVirtual();
  currentSelection: number;
  realizarPago = false;
  tipoVenta: TipoVenta;
  empleadoVendedorSeleccionado: Employee;
  selectedClienteApartado: ClienteResponseModel;
  dataTransferSub;
  totalizaSub;
  empleadoVendedorSub;
  apartadoTicketSub;
  applyDiscountSub;
  applyDiscountTxSub;
  authSub;
  suspenderSub;
  suspenderRequest = new SuspenderVentaRequest();
  articuloAgregado: boolean;
  tipoBusqueda;
  $articuloAgregado: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  articuloAgregadoMainSub;
  isPagoTcmm = false;
  isPagoWeb:boolean = false; // OCG: Definición de condición
  isPagoMayorista = false;
  isModoDevolucion = false;
  PagoTcmmData: PagoTCMM;
  FormasPagoInstance: FormasDePagoComponentInterface;
  secueciaApartado: number;
  cargaVentaResponseSub;
  mayoristaInfoPagoCredito: GetMayoristaMilanoResponseModel;
  isBuscandoSku: boolean;
  loggedInfo: UserResponse;
  totalizarResponse: TotalizarVentaResponseModel;
  aplicaSuspender: boolean;
  montoCreditoVtaEmp: Number;

  constructor(public _generalService: GeneralService, public _alertService: AlertService, public _salesService: SalesService,
              public _dataTransfer: DataTransferService, public _msgService: MsgService, public _modalService: BsModalService,
              public _configService: ConfigPosService, public _authService: AuthService, public _cargaVentaService: CargaVentaResponseService,
              public _router: Router) {


  }

  _TotalizarApartadoResponse: TotalizarApartadoResponseModel;

  get TotalizarApartadoResponse(): TotalizarApartadoResponseModel {
    return this._TotalizarApartadoResponse;
  }

  _TotalizarApartadoRequest: TotalizarApartadoModel;

  get TotalizarApartadoRequest(): TotalizarApartadoModel {
    return this._TotalizarApartadoRequest;
  }

  _realizarApartado: boolean;

  get realizarApartado(): boolean {
    return this._realizarApartado;
  }

  _TotalizarRequest: TotalizarVentaModel;

  get TotalizarRequest(): TotalizarVentaModel {
    return this._TotalizarRequest;
  }

  get TotalizarVentaResponse(): TotalizarVentaResponseModel {
    return this.totalizarResponse;
  }

  _pagoApartado: PagoApartado;

  get pagoApartado(): PagoApartado {
    return this.pagoApartado;
  }

  ngOnDestroy(): void {

    this.dataTransferSub.unsubscribe();
    this.totalizaSub.unsubscribe();
    this.empleadoVendedorSub.unsubscribe();
    this.articuloAgregadoMainSub.unsubscribe();
    this.apartadoTicketSub.unsubscribe();
    this.applyDiscountSub.unsubscribe();
    this.suspenderSub.unsubscribe();
    this.authSub.unsubscribe();
    this.cargaVentaResponseSub.unsubscribe();


    if (this.modalRef) {
      this.modalRef.hide();
    }

    if (this._modalService.getModalsCount() > 0) {
      this._modalService.hide(1);
    }
  }


  ngAfterViewInit(): void {
    setTimeout(() => this.seleccionaVendedor());
  }

  ngOnInit() {

    this.aplicaSuspender = false;

    this.apartadoTicketSub = this._dataTransfer.$apartadoTicketVirtual.subscribe(
      item => {
        this.realizarPago = true;
        this._pagoApartado = item;
      }
    );

    this.dataTransferSub = this._dataTransfer.$articuloTicketVirtual.subscribe(
      item => {
        this.addArticuloExterno(item);
      }
    );

    this.totalizaSub = this._dataTransfer.$ticketVirtualTotaliza.subscribe(flag => {
      if (flag) {
        this.totalizar();
      }
    });

    this.suspenderSub = this._dataTransfer.$suspenderTransaccion.subscribe(flag => {
      if (flag) {
        this.suspenderModal();
      }
    });

    this.empleadoVendedorSub = this._dataTransfer.$vendedorTicketVirtual.subscribe(
      empleado => this.empleadoVendedorSeleccionado = empleado
    );

    this.applyDiscountSub = this._dataTransfer.$applyDiscount.subscribe(descuentoModel => {
      this.applyDescuento(descuentoModel);
    });

    this.applyDiscountTxSub = this._dataTransfer.$applyDiscountTx.subscribe(descuentoModel => {
      this.applyDescuentoTx(descuentoModel);
    });

    this.articuloAgregadoMainSub = this.$articuloAgregado.subscribe(agregado => {
      this.articuloAgregado = agregado;
      this.setTicketTotalizado(false);
    });

    this._dataTransfer.$ticketVirtualInstance.next(this);
    this.tipoVenta = TipoVenta.VentaRegular;

    this.authSub = this._authService.loggedInfo.subscribe(userInfo => this.loggedInfo = userInfo);

    this.cargaVentaResponseSub = this._cargaVentaService.$ventaResponse.subscribe(
      venta => {
        if (venta) {
          this.cargaVentaResponse(venta);
        }
      }
    );

    this.bloqueaBotones(FlujoBloqueo.reset);


    this._modalService.onHidden.subscribe(() => {
      this.focusOnSkuInput();
    });

  }

  focusOnSkuInput() {
    setTimeout(() => {
      if (this._modalService.getModalsCount() === 0 && this.skuInput) {
        this.skuInput.nativeElement.focus();
      }
    }, 0);
  }

  bloqueoBotonesAfterBotonera() {

    if (this.tipoVenta === TipoVenta.VentaRegular) {
      this.bloqueaBotones(FlujoBloqueo.reset);
    } else if (this.tipoVenta === TipoVenta.VentaEmpleado) {
      this.bloqueaBotones(FlujoBloqueo.inicioVentaEmpleado);
    } else if (this.tipoVenta === TipoVenta.VentaMayorista) {
      this.bloqueaBotones(FlujoBloqueo.inicioVentaMayorista);
    } else if (this.tipoVenta === TipoVenta.devoluciones) {
      this.bloqueaBotones(FlujoBloqueo.inicioDevoluciones);
    }
  }


  seleccionaVendedor() {

    /** Se comenta momentaneamente **/
    /**
     const options: ModalOptions = {
      'class': 'modal-lg',
      'backdrop': 'static'
    };
     this.modalRef = this._modalService.show(BusquedaEmpleadoComponent, options);
     **/
  }

  resetTicket() {
    this.aplicaSuspender = false;
    this.sku = null;
    this.ticketVirtual = new TicketVirtual();
    this.resetSeleccion();
    this.empleadoVendedorSeleccionado = null;
    this.selectedClienteApartado = null;
    this.realizarPago = false;
    this._realizarApartado = false;
    this._TotalizarRequest = null;
    this._TotalizarApartadoRequest = null;
    this.totalizarResponse = null;
    this._TotalizarApartadoResponse = null;
    this.bloqueaBotones(FlujoBloqueo.reset);
    this._dataTransfer.$showFormasPago.next(null);
    this.$articuloAgregado.next(false);
    this._configService.applyColor(this.tipoVenta);
    this.isPagoTcmm = false;
    this.isPagoMayorista = false;
    this.isModoDevolucion = false;
    this._pagoApartado = null;
    this.mayoristaInfoPagoCredito = null;

    this.clearSeachField();

    if (this.tipoVenta.toString() === TipoVenta.VentaRegular.toString()) {
      this.seleccionaVendedor();
    }
  }

  cancelarTicket(saltarRazones?: boolean, doLogout?: boolean) {

    this.modalRef = this._modalService.show(CancelarTransaccionComponent, {'class': 'modal-dialogCenter'});

    this.modalRef.content.cancelarTicket.take(1).subscribe((cancelar) => {
      if (cancelar && !saltarRazones) {

        return new SudoCallbackFactory({
          component: this,
          ModalLevel: 1,
          passthroughAdmin: true,
          callBack: 'ingresaRazonCancelacion',
          callbackParams: [doLogout],
          modalService: this._modalService
        });


      } else {
        this.resetTicket();
      }
    });

  }

  ingresaRazonCancelacion(doLogout?: boolean) {
    const initialState = {ticketVirtualInstance: this, doLogout: doLogout};
    this._modalService.show(RazonesCancelacionComponent, {initialState});
  }

  returnTicket() {

    const returnTickeFn = () => {
      this._configService.applyColor(this.tipoVenta);
      this.realizarPago = false;
      this._dataTransfer.$showFormasPago.next(null);
      this._TotalizarRequest = null;
      this._TotalizarApartadoRequest = null;
      this.totalizarResponse = null;
      this._TotalizarApartadoResponse = null;


      /** En este orden para ejecucion correcta **/
      this.resetSeleccion();
      this.ticketVirtual.removePromocionesFromTicketRow();
      this.setTicketTotalizado(false);
      this.ticketVirtual.calculateTotal();


      setTimeout(() => { // para darle tiempo al rendering de la botonera

        if (this.tipoVenta === TipoVenta.VentaMayorista) {
          this.bloqueaBotones(FlujoBloqueo.inicioVentaMayorista);
        } else if (this.tipoVenta === TipoVenta.VentaEmpleado) {
          this.bloqueaBotones(FlujoBloqueo.inicioVentaEmpleado);
        } else if (this.realizarApartado) {
          this.bloqueaBotones(FlujoBloqueo.inicioApartados);
        } else if (this.tipoVenta === TipoVenta.devoluciones) {
          this.bloqueaBotones(FlujoBloqueo.finDevoluciones);
        }
        this.bloqueaBotones();
      }, 100);
    };

    if (this.tipoVenta.toString() === TipoVenta.VentaMayorista.toString() ||
      (this.tipoVenta.toString() === TipoVenta.devoluciones.toString() && this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta ===  TipoCabeceraTotalizar.ventaMayorista)) {


      this._salesService.eliminarLineaMayorista(this.ticketVirtual.cabeceraVenta).subscribe(
        resp => {
          if (resp.codeNumber === '368') {
            // cambio RAHC: 
            let exists = this.ticketVirtual.findBySku(this._configService.currentConfig.skuPagoConValeMayorista);
            if (exists) {
              this.ticketVirtual.removeArticulo(this.ticketVirtual.findBySku(this._configService.currentConfig.skuPagoConValeMayorista));
              this.ticketVirtual.secuencia--;
            }
            returnTickeFn();
          }

        });

    } else {
      returnTickeFn();
    }
  }

  declineCancelarTicket(): void {
    this.modalRef.hide();
  }

  skuOnEnter() {

    this.bloqueaBotones(FlujoBloqueo.inicioTotalizar);

    const config = this._configService.currentConfig;

    if (!this.sku || !this.sku.length || Number(this.sku) === config.skuPagoConValeMayorista) {
      this._alertService.show({
        tipo: 'error', titulo: 'Milano',
        mensaje: 'El SKU ingresado es inv\u00E1lido'
      });

      this.bloqueaBotones(FlujoBloqueo.falloTotalizar);

      return;
    }

    const request = {
      sku: this.sku
    };

    const ProductoRequest = new ProductsRequest(request);

    this.isBuscandoSku = true;

    const unBlockCallBack = () => {
      this.isBuscandoSku = false;
      this.focusOnSkuInput();
    };

    this._generalService.ProductosService(ProductoRequest).subscribe((resp) => {
        if (this.isModoDevolucion) {
          if (!this.ticketVirtual.applyDevolucion(resp[0])) {
            this._alertService.show({tipo: 'warning', titulo: 'Milano', mensaje: 'Art\u00EDculo no encontrado para devolución'});
          } else {
            this.sku = '';
            this.clearSeachField();
          }
        } else {
          //OCG: Entra para agregar el SKU
          //alert(JSON.stringify(resp));
          this.ProductosServiceNext(resp).then(unBlockCallBack).catch(unBlockCallBack);
          this.setTicketTotalizado(false);
        }
      },
      err => {
        this.isBuscandoSku = false;
      }
    );
  }


  ProductosServiceNext(response: Array<ProductsResponse>) {
    return new Promise((resolve, reject) => {

      if (response.length) {
        const articulo = response[0].articulo; // se extrae solo información del articulo;
        
        // const descuentosInfo = response[0].descuentosPromocionalesArticulo;
        if (this.ticketVirtual.findSkuValidatePriceChange(articulo.sku)) {
          this._alertService.show({
            tipo: 'warning', titulo: 'Milano',
            mensaje: 'No se admite agregar nuevos art\u00EDculos una vez que se ha modificado su precio'
          });
          reject();
          return;
        }

        if (this.ticketVirtual.findSkuValidateDiscountApplied(articulo.sku)) {
          this._alertService.show({
            tipo: 'warning', titulo: 'Milano',
            mensaje: 'No se admite agregar nuevos art\u00EDculos una vez que se ha aplicado descuento'
          });
          reject();
          return;
        }

        if (articulo.digitoVerificadorArticulo && articulo.digitoVerificadorArticulo.inconsistencia) {
          let msg = 'Se levantar\u00E1 una incidencia al gerente debido a';
          msg += ' que el siguiente art\u00EDculo se encuentra mal etiquetado.\n';

          msg += `\n${articulo.sku}`;

          this._msgService.setMsg({
            message: msg
          });
        }

        const tipoVentaGetLineaTicket = this.realizarApartado ? TipoVenta.Apartado : this.tipoVenta;

        //debugger;
        const getLineaTicket = this.ticketVirtual.getLineaTicket(response[0], tipoVentaGetLineaTicket);
        if (!getLineaTicket) {
          reject();
          return;
        }
        const lineaTicket = getLineaTicket.lineaTicket;
        const isNewLineaTicket = getLineaTicket.isNewItem;

        if (isNewLineaTicket) {
          this.sendLineaTicket(lineaTicket).then(
            (resp: OperacionLineaTicketVentaResponse) => {  // si se agrego la linea correctamente al Back, se incrementa la secuencia y se agrega la linea al ticket
              if (resp && !!resp.folioOperacion) {

                const ticketRow = this.ticketVirtual.addArticulo(lineaTicket, resp); // se agrega linea como nuevo articulo
                this.setInfoAfterAgregar(ticketRow);
              } else {
                this.ticketVirtual.removeArticuloByLineaTicket(lineaTicket);
              }

              resolve();

            }, err => reject()
          );
        } else {
          this.sendCambioPiezasLineaTicket(lineaTicket).then(
            resp => {

              if (resp && Number(resp.codeNumber) === 308) {

                const ticketRow = this.ticketVirtual.updateLineaTicketCambioPieza(lineaTicket);
                this.setInfoAfterAgregar(ticketRow);
              }

              resolve();
            }, err => reject()
          );
        }


      } else {
        this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Art\u00EDculo no encontrado'});
        resolve();
      }


    });
  }

  setInfoAfterAgregar(ticketRow: TicketRow) {

    this._dataTransfer.$detalleProducto.next({
      itemImageUrl: '',
      rutaImagenLocal: ticketRow.lineaTicket.articulo.rutaImagenLocal,
      rutaImagenRemota: ticketRow.lineaTicket.articulo.rutaImagenRemota,
      itemPrice: ticketRow.price,
      itemEstilo: ticketRow.estilo,
      itemSku: ticketRow.sku.toString()
    });

    this.sku = '';
    this.$articuloAgregado.next(true);
    this.bloqueaBotones(FlujoBloqueo.falloTotalizar);
    this.bloqueaBotones();
  }

  clearSeachField() {

    this._dataTransfer.$detalleProducto.next({
      itemImageUrl: 'assets/images/producto.png',
      itemPrice: null,
      itemEstilo: '',
      itemSku: ''
    });
  }

  suspenderModal() {
    this.modalRef = this._modalService.show(this.suspenderTemplate, {'class': 'modal-dialogCenter'});
  }

  suspenderTransaccion() {

    this.aplicaSuspender = true;
    this.ticketVirtual.calculateTotal();
    this.initCabeceraVenta();

    this.suspenderRequest.cabeceraVentaAsociada = this.ticketVirtual.cabeceraVenta;

    this._salesService.SuspenderVentaService(this.suspenderRequest).subscribe(
      resp => {
        if (Number(resp.codeNumber) === 308) {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Transacción suspendida correctamente'});
          if (this.modalRef) {
            this.modalRef.hide();
          }
          this.resetTicket();
        } else {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: resp.codeDescription});
        }
      }
    );
  }

  createBaseTotalizarApartadoRequest(request: TotalizarApartadoModel): TotalizarApartadoModel {
    request.cabeceraVentaAsociada = new CabeceraApartadosRequest();
    request.cabeceraVentaAsociada.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.apartado;
    request.cabeceraVentaAsociada.codigoEmpleadoVendedor = this.empleadoVendedorSeleccionado ? this.empleadoVendedorSeleccionado.code : 0;
    request.cabeceraVentaAsociada.folioOperacion = this.ticketVirtual.cabeceraVenta.folioOperacion;
    request.cabeceraVentaAsociada.importeVentaBruto = this.ticketVirtual.cabeceraVenta.importeVentaBruto;
    request.cabeceraVentaAsociada.importeVentaImpuestos = this.ticketVirtual.cabeceraVenta.importeVentaImpuestos;
    request.cabeceraVentaAsociada.importeVentaNeto = this.ticketVirtual.cabeceraVenta.importeVentaNeto;
    return request;
  }

  getSelectedItem(selectedItem: {
    item: TicketRow, index: number
  }) {
    const articulo = selectedItem.item.lineaTicket.articulo;

    const cambiaPrecio = (
      selectedItem.item.tipoProducto === TiposProductos.prenda
      && !this.realizarApartado
      && this.tipoVenta !== TipoVenta.devoluciones
      && this.tipoVenta !== TipoVenta.VentaEmpleado
      && !selectedItem.item.discountAdded
      && !selectedItem.item.discountTxAdded
      && !selectedItem.item.hasPromociones()
      && !selectedItem.item.discountPicos
      && !selectedItem.item.discountDanio
    );

    const descuentos = (
      selectedItem.item.tipoProducto === TiposProductos.prenda
      && this.tipoVenta !== TipoVenta.devoluciones
      && this.tipoVenta !== TipoVenta.VentaEmpleado
      && !selectedItem.item.priceChanged && !this.realizarApartado
      && !selectedItem.item.hasPromociones()
      && !selectedItem.item.discountPicos
      && !selectedItem.item.discountDanio
    );

    const descuentosDirectos = !selectedItem.item.discountTxAdded;
    const descuentosTx = !selectedItem.item.discountAdded;

    this._dataTransfer.$detalleProducto.next({
      itemSku: articulo.sku.toString(),
      itemEstilo: articulo.estilo,
      itemPrice: articulo.precioConImpuestos,
      itemImageUrl: articulo.rutaImagenLocal
    });

    this.currentSelection = selectedItem.index;
    this.ticketVirtual.currentSelection = selectedItem.index;

    this.bloqueaBotones(FlujoBloqueo.selectedItem, [
      {boton: Botones.cambiarPrecioArticulo, action: cambiaPrecio ? 'enabled' : '', dontHidde: true},
      {boton: Botones.descuentos, action: descuentos ? 'enabled' : '', dontHidde: true},
      {boton: Botones.descuentoImporte, action: descuentosDirectos ? 'enabled' : '', dontHidde: true},
      {boton: Botones.descuentoPorcentaje, action: descuentosDirectos ? 'enabled' : '', dontHidde: true},
      {boton: Botones.mercanciaDanada, action: descuentosDirectos ? 'enabled' : '', dontHidde: true},
      {boton: Botones.picosMercancia, action: descuentosDirectos ? 'enabled' : '', dontHidde: true},
      {boton: Botones.descuentoTransaccionImporte, action: descuentosTx ? 'enabled' : '', dontHidde: true},
      {boton: Botones.descuentoTransaccionPorcentaje, action: descuentosTx ? 'enabled' : '', dontHidde: true}
    ]);

  }

  sudoCambiarPrecioArticulo() {
    return new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'cambiaPrecioArticulo',
      modalService: this._modalService
    });
  }

  addArticuloExterno(articuloExterno: ProductsResponse | Array<ProductsResponse>) {

    if (articuloExterno instanceof Array) {

      const arrayPromises = articuloExterno.map(
        productsResponse => () => {
          return this.ProductosServiceNext([productsResponse]);
        }
      );

      arrayPromises.reduce((promiseChain, currentTask) => {

        return promiseChain.then(() => {
          return currentTask().then();
        });

      }, Promise.resolve([])).then(() => {
      });

    } 
    else {
      this.ProductosServiceNext.bind(this)([articuloExterno]);
    }

    this.clearSeachField();
    this.bloqueaBotones();

  }

  cargaVentaResponse(venta: VentaResponseModel) {
    this.ticketVirtual = new TicketVirtual(venta);

    if (venta.informacionEmpleadoVendedor) {
      this._dataTransfer.$vendedorTicketVirtual.next(venta.informacionEmpleadoVendedor);
    }

    this.initCabeceraVenta();
    this._cargaVentaService.ventaResponse = null;

    let flujoBloqueo = null;

    if (!this.isModoDevolucion) {
      this.$articuloAgregado.next(true);
    } else {
      flujoBloqueo = FlujoBloqueo.inicioDevoluciones;
    }

    setTimeout(() => {
      this.clearSeachField();
      this.bloqueaBotones(flujoBloqueo);
    }, 100);


  }

  bloqueaBotones(flujoBloqueo?: FlujoBloqueo, items?: Array<BotoneraPeticion>)  {

    const bloqueaBtn = actions => {
      [].forEach.call(actions, action => {
        this._dataTransfer.$coordinadorFuncionesBotonera.next(action);
      });
    };

    const reglaTotalizarApartado = () => {
      if (this.realizarApartado) {
        if (this.ticketVirtual.totalTicket > this._configService.currentConfig.montoMinimoAbonoApartado) {
          bloqueaBtn([{boton: Botones.totalizarVenta, action: 'enabled', dontHidde: true}]);
        } else {
          bloqueaBtn([{boton: Botones.totalizarVenta, action: 'disabled', dontHidde: true}]);
        }
      }
    };

    if (!flujoBloqueo) {
      if (this.ticketVirtual.totalItems > 0) {


        const suspenderTransaccionBoolean = this.realizarApartado || this.isPagoTcmm ? 'disabled' : 'enabled';

        bloqueaBtn([{boton: Botones.buscarVendedor, action: 'disabled', dontHidde: true},
          {boton: Botones.consultaSaldoMM, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoTarjetaMM, action: 'disabled', dontHidde: true},
          {boton: Botones.ventaEmpleado, action: 'disabled', dontHidde: true},
          {boton: Botones.ventaMayoristas, action: 'disabled', dontHidde: true},
          {boton: Botones.buesquedaLealtad, action: 'disabled', dontHidde: true},
          {boton: Botones.ventaRegular, action: 'disabled', dontHidde: true},
          {boton: Botones.devoluciones, action: 'disabled', dontHidde: true},
          {boton: Botones.suspenderTransaccion, action: suspenderTransaccionBoolean, dontHidde: true},
          {boton: Botones.recuperarTransaccion, action: 'disabled', dontHidde: true},
          {boton: Botones.postAnulacion, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoMayorista, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoWebx, action: 'disabled', dontHidde: true}, //OCG:
          {boton: Botones.cancelar, action: 'enabled', dontHidde: true},
          {boton: Botones.tiempoAire, action: 'disabled', dontHidde: true},
          {boton: Botones.apartados, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoServicios, action: 'disabled', dontHidde: true},
          {boton: Botones.gerente, action: 'disabled', dontHidde: true},
          {boton: Botones.tarjetaRegalo, action: 'disabled', dontHidde: true}]);


        switch (this.ticketVirtual.tipoItems) {
          case TiposProductos.prenda:
          case TiposProductos.tarjetaRegalo:
          case TiposProductos.lineaSkuMayorista:
            bloqueaBtn([{boton: Botones.tarjetaRegalo, action: 'enabled', dontHidde: true}]);
            break;
          case TiposProductos.tiempoAire:
          case TiposProductos.servicio:
            bloqueaBtn([{boton: Botones.suspenderTransaccion, action: 'disabled', dontHidde: true}]);
            break;

        }


      }

      reglaTotalizarApartado();
      return;
    }

    switch (flujoBloqueo) {
      case FlujoBloqueo.reset:
        bloqueaBtn([{boton: Botones.reset, action: 'enabled', dontHidde: true}]);
        break;
      case FlujoBloqueo.removedItem:
        bloqueaBtn([{boton: Botones.cambiarPrecioArticulo, action: 'disabled', dontHidde: true},
          {boton: Botones.descuentos, action: 'disabled', dontHidde: true}]);

        if (this.ticketVirtual.totalItems === 0) {
          bloqueaBtn([{boton: Botones.suspenderTransaccion, action: 'disabled', dontHidde: true}]);
        }

        reglaTotalizarApartado();
        break;
      case FlujoBloqueo.selectedItem:
        bloqueaBtn(items);
        break;
      case FlujoBloqueo.finDevoluciones:
        bloqueaBtn([{boton: Botones.reset, action: 'enabled', dontHidde: true}]);
        bloqueaBtn([
          {boton: Botones.recuperarTransaccion, action: '', dontHidde: false},
          {boton: Botones.pagoServicios, action: 'disabled', dontHidde: true},
          {boton: Botones.tiempoAire, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoMayorista, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoTarjetaMM, action: 'disabled', dontHidde: true},
          {boton: Botones.ventaEmpleado, action: 'disabled', dontHidde: true},
          {boton: Botones.devoluciones, action: 'disabled', dontHidde: true},
          {boton: Botones.ventaMayoristas, action: 'disabled', dontHidde: true},
          {boton: Botones.buesquedaLealtad, action: 'disabled', dontHidde: true},
          {boton: Botones.ventaRegular, action: 'disabled', dontHidde: true},
          {boton: Botones.buscarVendedor, action: '', dontHidde: true},
          {boton: Botones.apartados, action: '', dontHidde: true},
          {boton: Botones.postAnulacion, action: '', dontHidde: false}
        ]);
        break;
      case FlujoBloqueo.inicioVentaEmpleado:
        bloqueaBtn([{boton: Botones.buscarVendedor, action: '', dontHidde: true}, {boton: Botones.apartados, action: '', dontHidde: true}]);
        bloqueaBtn([{boton: Botones.postAnulacion, action: '', dontHidde: false}]);
        bloqueaBtn([
          {boton: Botones.recuperarTransaccion, action: '', dontHidde: false},
          {boton: Botones.pagoServicios, action: 'disabled', dontHidde: true},
          {boton: Botones.tiempoAire, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoMayorista, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoTarjetaMM, action: 'disabled', dontHidde: true}
        ]);
        break;
      case FlujoBloqueo.inicioDevoluciones:
        bloqueaBtn([{boton: Botones.blockAll, action: 'enabled', dontHidde: true}]);
        bloqueaBtn([{boton: Botones.cancelar, action: 'enabled', dontHidde: true}]);
        break;
      case FlujoBloqueo.inicioVentaMayorista:
        bloqueaBtn([{boton: Botones.apartados, action: '', dontHidde: true}]);
        bloqueaBtn([{boton: Botones.postAnulacion, action: '', dontHidde: false}]);
        bloqueaBtn([
          {boton: Botones.recuperarTransaccion, action: '', dontHidde: false},
          {boton: Botones.pagoServicios, action: 'disabled', dontHidde: true},
          {boton: Botones.tiempoAire, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoMayorista, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoTarjetaMM, action: 'disabled', dontHidde: true}
        ]);
        break;
      case FlujoBloqueo.inicioApartados:
        bloqueaBtn([{boton: Botones.otrosIngresos, action: 'disabled', dontHidde: true},
          {boton: Botones.totalizarVenta, action: 'disabled', dontHidde: true},
          {boton: Botones.postAnulacion, action: '', dontHidde: true},
          {boton: Botones.recuperarTransaccion, action: '', dontHidde: true},
          {boton: Botones.suspenderTransaccion, action: 'disabled', dontHidde: true},
          {boton: Botones.pagoTarjetaMM, action: 'disabled', dontHidde: true},
          {boton: Botones.apartados, action: 'disabled', dontHidde: true}
        ]);
        break;
      case FlujoBloqueo.inicioTotalizar:
        bloqueaBtn([{boton: Botones.suspenderTransaccion, action: 'disabled', dontHidde: true},
          {boton: Botones.totalizarVenta, action: 'disabled', dontHidde: true}]);
        break;
      case FlujoBloqueo.medioTotalizar:
        bloqueaBtn([{boton: Botones.suspenderTransaccion, action: 'disabled', dontHidde: true},
          {boton: Botones.totalizarVenta, action: 'enabled', dontHidde: true}]);
        break;
      case FlujoBloqueo.falloTotalizar:
        bloqueaBtn([{boton: Botones.suspenderTransaccion, action: 'enabled', dontHidde: true},
          {boton: Botones.totalizarVenta, action: 'enabled', dontHidde: true}]);
        break;
      case FlujoBloqueo.financiamientoAgregado:
        bloqueaBtn([{ boton: PagosOps.financiamento, action: 'disabled', dontHidde: false }]);
        break;
    }

  }

  aceptarCambioPrecio(newPrice: number, codigoRazon: number) {

    const lineaTicketCambioPrecio = this.ticketVirtual.generaLineaCambioPrecio(this.currentSelection, newPrice);

    const requestCambioPrecio = new CambiarPrecioRequest({
      lineaTicket: lineaTicketCambioPrecio,
      codigoRazon: codigoRazon
    });

    this.sendCambioPrecioLineaTicket(requestCambioPrecio).then(
      resp => {
        if (resp && Number(resp.codeNumber) === 308) {
          this.ticketVirtual.updatePriceOnSelectedRow(newPrice);
          this._modalService.onHide.take(1).subscribe(() => {
            this.resetSeleccion();
          });
          this.modalRef.hide();
          this.setTicketTotalizado(false);
        }
      }
    );
  }

  resetSeleccion() {
    this.currentSelection = null;
    this.ticketVirtual.currentSelection = null;
    this.bloqueaBotones(FlujoBloqueo.selectedItem, [
      {boton: Botones.cambiarPrecioArticulo, action: 'disabled', dontHidde: true},
      {boton: Botones.descuentos, action: 'disabled', dontHidde: true}
    ]);
    this.clearSeachField();
  }

  seleccionarClienteApartado() {
    if (this.articuloAgregado) {
      return;
    }
    const initialState = {ticketVirtualInstance: this};
    this.modalRef = this._modalService.show(BusquedaClienteComponent, {class: 'modal-lg', initialState});
  }

  setClienteApartado(cliente: ClienteResponseModel) {
    this._realizarApartado = true;
    this.selectedClienteApartado = cliente;
    this.bloqueaBotones(FlujoBloqueo.inicioApartados);
  }

  getSeletedItem() {
    return this.ticketVirtual.getSelectedTicketRow();
  }

  setFormasPagoInstance(instance) {
    this.FormasPagoInstance = instance;
  }

  sendPagoMayorista(mayoristaInfo: GetMayoristaMilanoResponseModel, lineaTicket: Array<ProductsResponse>) {
    this.isPagoMayorista = true;
    this.mayoristaInfoPagoCredito = mayoristaInfo;
    this.addArticuloExterno(lineaTicket);

  }

  sendLineaTicket(lineaTicket: LineaTicket) {
    this.initCabeceraVenta();
    this.ticketVirtual.cabeceraVenta.codigoEmpleadoVendedor = this.empleadoVendedorSeleccionado ? this.empleadoVendedorSeleccionado.code : 0;
    lineaTicket.cabeceraVentaAsociada = Object.assign({}, this.ticketVirtual.cabeceraVenta);
    return this._salesService.agregarLineaTicketVenta(lineaTicket.getLineaTicket(), this.realizarApartado).toPromise();
  }

  sendCambioPiezasLineaTicketDevolucion(devolverRequest: DevolverArticuloRequest) {
    devolverRequest.lineaTicket.cabeceraVentaAsociada = Object.assign({}, this.ticketVirtual.cabeceraVenta);
    return this._salesService.cambiarPiezasArticuloLineaTicketDevolucion(devolverRequest).toPromise();
  }

  sendCambioPiezasLineaTicket(lineaTicket: LineaTicket) {
    this.bloqueaBotones(FlujoBloqueo.inicioTotalizar);
    lineaTicket.cabeceraVentaAsociada = Object.assign({}, this.ticketVirtual.cabeceraVenta);
    return this._salesService.cambiarPiezasLineaTicketVenta(lineaTicket.getLineaTicket(), this.realizarApartado).toPromise();
  }

  sendCambioPrecioLineaTicket(cambiaPrecioRequest: CambiarPrecioRequest) {
    Object.assign(cambiaPrecioRequest.lineaTicket.cabeceraVentaAsociada, this.ticketVirtual.cabeceraVenta);
    return this._salesService.cambiarPrecioLineaTicketVenta(cambiaPrecioRequest, this.realizarApartado).toPromise();
  }

  sendEliminarLineaTicket(eliminarLinea: EliminarLineaTicket) {
    this.bloqueaBotones(FlujoBloqueo.inicioTotalizar);
    eliminarLinea.lineaTicket.cabeceraVentaAsociada = Object.assign({}, this.ticketVirtual.cabeceraVenta);
    return this._salesService.eliminarLineaTicketVenta(eliminarLinea, this.realizarApartado).toPromise();
  }

  sendDescuentoLineaTicket(lineaTicket: LineaTicket) {
    lineaTicket.cabeceraVentaAsociada = Object.assign({}, this.ticketVirtual.cabeceraVenta);
    return this._salesService.descuentoDirectoVenta(lineaTicket.getLineaTicket()).toPromise();
  }

  initCabeceraVenta() {
    //debugger;

    if (this.ticketVirtual.tipoItems === TiposProductos.tiempoAire) {
      this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.tiempoAire;
    } else if (this.ticketVirtual.tipoItems === TiposProductos.servicio || this.ticketVirtual.tipoItems === TiposProductos.lineaComisionServicios) {
      this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.servicios;
    } else {
      this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.ventaRegular;
    }

    if (this.realizarApartado) {
      this.ticketVirtual.cabeceraVenta.codigoCliente = this.selectedClienteApartado.codigoCliente;
      this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.apartado;
    }

    if (this.isPagoMayorista) {
      this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.ventaMayorista;
      this.ticketVirtual.cabeceraVenta.codigoMayoristaCredito = this.mayoristaInfoPagoCredito.codigoMayorista;
      this.ticketVirtual.cabeceraVenta.nombreMembresia = this.mayoristaInfoPagoCredito.nombre;

    }

    if (this.isPagoTcmm) {
      this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.tarjetaMM;
    }

    if(this.isPagoWeb)
    {
      this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.pagoWeb;
      this.isPagoWeb = false;// OCG apagar la bandera
    }

    this.ticketVirtual.cabeceraVenta.codigoEmpleadoVendedor = this.empleadoVendedorSeleccionado ? this.empleadoVendedorSeleccionado.code : 0;

  }

  sendPagoTCMM(pagoTcmm: PagoTCMM, lineaTicket: Array<ProductsResponse>) {
    //debugger;
    this.ticketVirtual.totalSale = pagoTcmm.cantidadPagar;
    this.ticketVirtual.totalTicket = pagoTcmm.cantidadPagar;
    this.isPagoTcmm = true;
    this.PagoTcmmData = pagoTcmm;

   
    this.addArticuloExterno(lineaTicket);

  }

  //OCG: Método para el pago Web
  sendPagoWeb(lineaTicket: Array<ProductsResponse>) {
    this.isPagoWeb = true;
    this.addArticuloExterno(lineaTicket);
  }

  setTicketTotalizado(isTotalizado: boolean) {

    this.ticketVirtual.isTotalizado = isTotalizado;
    if (!isTotalizado) {
      this.ticketVirtual.ticketDescuentos.resetDescuentos();
    }

  }

  totalizar() {
   
    if (this.ticketVirtual.isTotalizado) {
      this.sendTotalizarRequest();
      return;
    }

    this.ticketVirtual.calculateTotal();

    if (!this.ticketVirtual.totalItems) {
      this._alertService.show({
        titulo: 'Milano', mensaje: 'Para continuar es necesario agregar al menos un art\u00EDculo al ticket de venta.', tipo: 'warning'
      });
      return;
    }

    if (this.realizarApartado) {
      this._TotalizarApartadoRequest = this.createBaseTotalizarApartadoRequest(new TotalizarApartadoRequest());
      this.sendTotalizarApartadoRequest();
      this.secueciaApartado = this.ticketVirtual.secuencia;
    } else {
      this._TotalizarRequest = new TotalizarVentaRequest({
        cabeceraVentaAsociada: this.ticketVirtual.cabeceraVenta,
        secuenciaActual: this.ticketVirtual.secuencia
      });


      if (this.ticketVirtual.isDevolucion) {
        this.checkDevolucionFavor();
      } else {
        this.sendTotalizarRequest();
      }

    }

  }

  sendTotalizarRequest() {

   
    this.bloqueaBotones(FlujoBloqueo.inicioTotalizar);

    if (this.ticketVirtual.isDevolucion && this.ticketVirtual.isTotalizado) {
      if (this.ticketVirtual.totalTicketFavorDiferencia >= 0 && this.ticketVirtual.totalTicket === 0) {
        this.ticketVirtual.cabeceraVenta.clienteTieneSaldoPendientePagar = false;
        this.checkDevolucionFavor();
      } else {
        this.checkDevolucionAfterTotalizar(this.totalizarResponse, this._TotalizarRequest);
      }
      return;
    } else if (this.ticketVirtual.isDevolucion && !this.ticketVirtual.isTotalizado && this.ticketVirtual.totalTicket > 0) {
      this.ticketVirtual.cabeceraVenta.clienteTieneSaldoPendientePagar = true;
    } else if (this.ticketVirtual.isTotalizado) {
        this.showFormasPagoTotalizar();
        return;
    }

    //debugger; 
    this._salesService.TotalizarVentaService(this._TotalizarRequest).subscribe(
      resp => {
        //alert('Cargar formas de pago para el ticket')

        //debugger;
        if (resp.productoPagoConValeMayorista) {
          this.ticketVirtual.cargaArticuloMayorista(resp.productoPagoConValeMayorista);
          this._TotalizarRequest.secuenciaActual++;
          this.ticketVirtual.secuencia++;
        }

        this.setTicketTotalizado(true);

        this.ticketVirtual.removePromocionesFromTicketRow();
        this.ticketVirtual.ticketDescuentos.resetDescuentos();
        this.ticketVirtual.ticketDescuentos.applyDescuentosAplicadosLinea(resp.descuentosPromocionalesAplicadosLinea);
        this.ticketVirtual.ticketDescuentos.applyDescuentosAplicadosVenta(resp.descuentosPromocionalesAplicadosVenta);
        this.ticketVirtual.ticketDescuentos.descuentosPosiblesLinea = resp.descuentosPromocionalesPosiblesLinea;
        this.ticketVirtual.ticketDescuentos.descuentosPosiblesVenta = resp.descuentosPromocionalesPosiblesVenta;

        this.bloqueaBotones(FlujoBloqueo.medioTotalizar);
        this.resetSeleccion();
        
        this.totalizarResponse = resp;

        // RAHC:  CONDICION PARA QUITAR FORMA DE PAGO FINANCIAMIENTO SI NO TIENE CREDITO
        if (this.tipoVenta == TipoVenta.VentaEmpleado && this.montoCreditoVtaEmp <= 0) {
          let quitafinanciamiento = this.totalizarResponse.informacionAsociadaFormasPago.filter( x => x.codigoFormaPago != 'FN');
          this.totalizarResponse.informacionAsociadaFormasPago = quitafinanciamiento;
        }

        if (this.ticketVirtual.isDevolucion && !resp.descuentosPromocionalesAplicadosLinea.length && !resp.descuentosPromocionalesAplicadosVenta.length) {
          this.checkDevolucionAfterTotalizar(resp, this._TotalizarRequest);
          return;
        }

        if (!resp.descuentosPromocionalesAplicadosLinea.length && !resp.descuentosPromocionalesAplicadosVenta.length) {
          this.showFormasPagoTotalizar();
        }

      },
      () => {
        this.setTicketTotalizado(false);
        this.bloqueaBotones(FlujoBloqueo.falloTotalizar);
      }
    );

   

  }

  showFormasPagoTotalizar() {
       //debugger;
    this.realizarPago = true;
    this._dataTransfer.$showFormasPago.next({
      totalizarInfo: this.totalizarResponse,
      pagoInfo: {
        tipoPago: this.ticketVirtual.tipoItems,
        total: this.ticketVirtual.totalSale
      }
    });
   
   
  }

  checkDevolucionAfterTotalizar(response: TotalizarVentaResponseModel, totalizarRequest: TotalizarVentaRequest) {
  }

  checkDevolucionFavor() {
  }

  sendTotalizarApartadoRequest() {
    this.bloqueaBotones(FlujoBloqueo.inicioTotalizar);
    this._salesService.TotalizarApartadoService(this._TotalizarApartadoRequest).subscribe(
      resp => {
        this._TotalizarApartadoResponse = resp;
        this.realizarPago = true;
        this._dataTransfer.$showFormasPago.next({
          totalizarApartado: resp,
          pagoInfo: {
            tipoPago: this.ticketVirtual.tipoItems,
            total: this.ticketVirtual.totalSale
          }
        });
      },
      () => {
        this.bloqueaBotones(FlujoBloqueo.falloTotalizar);
      }
    );
  }

  cambiaPrecioArticulo() {
    const initialState = {ticketVirtualInstance: this};
    this.modalRef = this._modalService.show(CambioDePrecioComponent, {class: 'modal-lg', initialState});
  }

  applyDescuento(descuento: Descuento) {

    const lineaTicketDescuento = this.ticketVirtual.generaLineaTicketDescuentoBySku(descuento.sku, descuento);

    this.sendDescuentoLineaTicket(lineaTicketDescuento).then(
      resp => {
        if (resp && Number(resp.codeNumber) === 308) {
          this.ticketVirtual.applyDiscountToItem(descuento);
          if (this.modalRef) {
            this.modalRef.hide();
          }
          this.resetSeleccion();
          this.setTicketTotalizado(false);
        }
      }
    );
    if ((descuento.tipoDescuento === TipoDescuento.importe || descuento.tipoDescuento === TipoDescuento.porcentaje)
      && this._configService.currentConfig.solicitarAutorizacionDescuentos && !this.aplicaSuspender) {
      this.suspenderTransaccion();
      this.focusOnSkuInput();
    }
  }

  // Versión: 1.2.4
  //OCG: Bucle de descuento por transacción o porcentaje
  // applyDescuentoTx(descuento: Array<Descuento>) {

  //   descuento.forEach (desc => {

  //     const lineaTicketDescuento = this.ticketVirtual.generaLineaTicketDescuentoBySku(desc.sku, desc);

  //     this.sendDescuentoLineaTicket(lineaTicketDescuento).then(
  //       resp => {

  //         console.log(JSON.stringify(resp));

  //         if (resp && Number(resp.codeNumber) === 308) {

  //           this.ticketVirtual.applyDiscountTxToItem(desc);
  //           if (this.modalRef) {
  //             this.modalRef.hide();
  //           }
  //         }
  //       }
  //     );
  //   });

  //   if (this._configService.currentConfig.solicitarAutorizacionDescuentos && !this.aplicaSuspender) {
  //     this.suspenderTransaccion();
  //     this.focusOnSkuInput();
  //   }

  // }



  async applyDescuentoTx(descuento: Array<Descuento>) {

    //console.log('applyDescuentoTx');

    const a = await  descuento.forEach  (desc => {

      const lineaTicketDescuento = this.ticketVirtual.generaLineaTicketDescuentoBySku(desc.sku, desc);

        //console.log(`Ticket con el descuento a iterar:${ JSON.stringify(desc)} `)

        this.sendDescuentoLineaTicket(lineaTicketDescuento).then(
        resp => {

          //console.log(`Resultado del WS: ${JSON.stringify(resp)}`);

          if (resp && Number(resp.codeNumber) === 308) {

            this.ticketVirtual.applyDiscountTxToItem(desc);
            if (this.modalRef) {
              this.modalRef.hide();
            }
          }
        }
      );
    });

    //console.log(JSON.stringify(a));

    if (this._configService.currentConfig.solicitarAutorizacionDescuentos && !this.aplicaSuspender) {
      this.suspenderTransaccion();
      this.focusOnSkuInput();
    }

  }




  selectRowUp() {

    const lastRow = this.ticketVirtual.ticketRow.length - 1;

    if (this.currentSelection === 0) {
      this.currentSelection = lastRow;
    } else if (this.currentSelection >= 0) {
      this.currentSelection--;
    } else {
      this.currentSelection = 0;
    }
    this.applySelectionFromKeyboard();

  }

  selectFirstRow() {
    if (!this.currentSelection && this.currentSelection !== 0) {
      this.currentSelection = 0;
      this.applySelectionFromKeyboard();
    } else {
      this.ticketVirtual.getSelectedTicketRow().articuloComponentInstance.setFocusOnQty();
    }
  }

  selectRowDown() {

    const lastRow = this.ticketVirtual.ticketRow.length - 1;

    if (this.currentSelection === lastRow) {
      this.currentSelection = 0;
    } else if (this.currentSelection >= 0) {
      this.currentSelection++;
    } else {
      this.currentSelection = 0;
    }

    this.applySelectionFromKeyboard();
  }

  isLastRow(): boolean {
    const lastRow = this.ticketVirtual.ticketRow.length - 1;
    return lastRow === this.currentSelection;
  }

  isFirstRow(): boolean {
    return this.currentSelection === 0;
  }

  jumpFocusToNextElement(): any {
    setTimeout(() => this.skuInput.nativeElement.focus(), 0);
  }

  jumpFocusToPrevElement(): any {
    setTimeout(() => this.skuInput.nativeElement.focus(), 0);
  }

  private applySelectionFromKeyboard() {
    this.ticketVirtual.currentSelection = this.currentSelection;
    this.getSelectedItem({
      item: this.ticketVirtual.getSelectedTicketRow(), index: this.currentSelection
    });
  }

}

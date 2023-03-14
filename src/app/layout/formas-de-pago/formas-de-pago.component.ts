import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { FinalizarVentaRequest } from '../../Models/Sales/FinalizarVentaRequest';
import { SalesService } from '../../services/sales.service';
import { ApartadoResponseModel } from '../../Models/Apartados/ApartadoResponse.model';
import { AlertService } from '../../services/alert.service';
import { AbonarApartadoRequest } from '../../Models/Apartados/AbonarApartadoRequest';
import {
  BotonesPagos,
  CambioPagos,
  PagosOps,
  TipoApartado,
  TipoCabeceraTotalizar,
  TipoDetalleVenta,
  TipoPago,
  TipoVenta
} from '../../shared/GLOBAL';
import { ConfigPosService } from '../../services/config-pos.service';
import { CrearApartadoRequest } from '../../Models/Apartados/CrearApartadoRequest';
import { PlazosApartadoResponse } from '../../Models/Apartados/PlazosApartadoResponse';
import { ClienteRequest } from '../../Models/Sales/ClienteRequest';
import Decimal from 'decimal.js';
import { FormaPagoUtilizado } from '../../Models/Pagos/FormaPagoUtilizado';
import { PagosToDisplayModel } from '../../Models/Pagos/PagosToDisplay.model';
import { PagosMasterService } from '../../services/pagos-master.service';
import { TotalesLast } from '../../Models/Pagos/TotalesLast';
import { PagosMaster } from '../../Models/Pagos/PagosMaster';
import { LineaPago } from './LineaPago';
import { VentaTarjetaRegaloComponent } from '../venta-tarjeta-regalo/venta-tarjeta-regalo.component';
import { InformacionFoliosTarjeta } from '../../Models/Sales/InformacionFoliosTarjeta';
import { RetiroParcialEfectivoComponent } from '../retiro-parcial-efectivo/retiro-parcial-efectivo.component';
import { InformacionAsociadaRetiroEfectivo } from '../../Models/General/InformacionAsociadaRetiroEfectivo';
import { GeneralService } from '../../services/general.service';
import { FormasDePagoComponentInterface } from '../../Models/FrontEnd/FormasDePagoComponentInterface';
import { SudoCallbackFactory } from '../../Models/General/SudoCallbackFactory';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { DosDecimalesPipe } from '../../pipes/dos-decimales.pipe';

@Component({
  selector: 'app-formas-de-pago',
  templateUrl: './formas-de-pago.component.html',
  styleUrls: ['./formas-de-pago.component.css'],
  providers: [SalesService, GeneralService, DosDecimalesPipe]
})
export class FormasDePagoComponent implements OnInit, OnDestroy, AfterViewInit, FormasDePagoComponentInterface {

  @Input() ticketVirtual: TicketVirtualComponentInterface;
  @ViewChild('plazoTemplate') plazoTemplate: TemplateRef<any>;
  @ViewChild('finalizarTemplate') finalizarTemplate: TemplateRef<any>;
  @ViewChild('retiroEfectivo') retiroEfectivo: TemplateRef<any>;

  cancelarSub;
  BotonPago: string;
  BotonCancelar: string;
  currentSelection: number;
  modalRef: BsModalRef;
  pagos: Array<LineaPago> = [];
  pagosBack = [];
  cliente: string;
  pagoApartado: ApartadoResponseModel;
  finalizarVentaRequest = new FinalizarVentaRequest();
  crearApartadoRequest;
  apartadoRequest = new AbonarApartadoRequest();
  pagoFinanciamiento: boolean;
  porcentajeApartado: number;
  montoApartado: number;
  validacionApartado: boolean;
  tipoA: boolean;
  tipoNA: boolean;
  VentaRegular: boolean;
  SelectPlazo;
  secuencia: number;
  totalVenta;
  totalVentaRequest;
  count: number;
  Cantidad: number;
  plazos: Array<PlazosApartadoResponse> = [];
  montoPago: number;
  pago: PagosToDisplayModel;
  totalesLast: TotalesLast;
  totalToPaidMonedaExtranjera;
  pagoRestanteAbono: number;
  selectP;
  numeroTarjetas: number;
  incremNumeroTarjetas: number;
  retiro: boolean;
  cerrar: boolean;
  mensajeRetiro: string;
  informacionRetiro: InformacionAsociadaRetiroEfectivo;
  @Output() formasPagoInstance = new EventEmitter();
  disabledEnter: boolean;
  totalTicketDev;

  constructor(public _dataTransfer: DataTransferService, public modalService: BsModalService,
    public router: Router, public ventaService: SalesService, public reasonsCodesTransactionService: SalesService,
    public _alertService: AlertService, public _configService: ConfigPosService, public _pagosMaster: PagosMasterService,
    public generalService: GeneralService) {
  }


  ngAfterViewInit() {
    /**Se inicializa modal de plazos de apartado en caso de creacion ed apartado */
    setTimeout(() => {
      if (this.ticketVirtual.realizarApartado && !this.ticketVirtual._pagoApartado) {
        this.ventaService.PlazosApartadoService().subscribe(
          resp => {
            if (resp.data.length) {
              this.plazos = [];
              resp.data.forEach(index => {
                this.plazos.push(index);
              });
            } else {
              this._alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: resp.result.codeDescription });
            }
          }
        );
        this.calcularMinimo();
        this.modalRef = this.modalService.show(this.plazoTemplate, { backdrop: 'static', keyboard: false });
      }
    });
  }

  ngOnInit() {

    this.disabledEnter = false;
    /**Se inicalizan variables de venta dependiendo si es o no apartado*/
    if (this.ticketVirtual.realizarApartado || this.ticketVirtual._pagoApartado) {
      this.crearApartadoRequest = new CrearApartadoRequest();
      this.totalVenta = this.ticketVirtual.TotalizarApartadoResponse;
      this.totalVentaRequest = this.ticketVirtual.TotalizarApartadoRequest;
      if (this.ticketVirtual._pagoApartado) {
        this.Cantidad = Number(this.ticketVirtual._pagoApartado.montoPago);
      }
    } else {
      this.totalVenta = this.ticketVirtual.TotalizarVentaResponse;
      this.totalVentaRequest = this.ticketVirtual.TotalizarRequest;
    }

    /**Se inicializan variables del total del ticketVirtual virtual  y totales*/
    this.updateVenta();
    this.BotonPago = BotonesPagos.FinalizarVenta;
    this.BotonCancelar = BotonesPagos.RegresarVenta;
    this.ticketVirtual.ticketVirtual.totalPaid = 0;
    this.numeroTarjetas = 0;
    this.incremNumeroTarjetas = 0;
    this.cerrar = false;

    /**Validacion para abono de apartado y venta regular */
    if (this.ticketVirtual.tipoVenta === TipoVenta.VentaRegular && this.ticketVirtual._pagoApartado) {
      this.VentaRegular = true;
      this.BotonCancelar = BotonesPagos.CancelarApartados;
    }

    /**Suscripción para resetear ticketVirtual */
    this.cancelarSub = this._dataTransfer.$anularTransaccion.subscribe(
      item => this.resetTicket()
    );
    /**Aplicacion de color paraformas de pago */
    this._configService.applyColor(TipoVenta.formasDepago);
    /**Inicializacion de secuencia y linea mayoristaa */
    if (!this.ticketVirtual.isPagoTcmm && !this.ticketVirtual.isPagoMayorista) {
      if (this.ticketVirtual._pagoApartado) {
        this.totalApartado();
        this.secuencia = this.ticketVirtual._pagoApartado.pagoApartado.consecutivoSecuenciaFormasPago;
      } else if (this.ticketVirtual.realizarApartado) {
        this.secuencia = this.ticketVirtual.secueciaApartado + 1;

        /**Agrega linea a ticketVirtual cuando es venta mayorista*/
      } else if (this.ticketVirtual.tipoVenta === TipoVenta.VentaMayorista) {
        const importeBruto = Number(new Decimal(this.totalVentaRequest.cabeceraVentaAsociada.importeVentaNeto).minus(
          this.totalVentaRequest.cabeceraVentaAsociada.importeVentaImpuestos));
        this.finalizarVentaRequest.informacionMayorista = {
          codigoMayorista: this.totalVentaRequest.cabeceraVentaAsociada.codigoMayorista,
          importeVentaBruto: importeBruto,
          importeVentaImpuestos: this.totalVentaRequest.cabeceraVentaAsociada.importeVentaImpuestos,
          importeVentaNeto: this.totalVentaRequest.cabeceraVentaAsociada.importeVentaNeto
        };
        setTimeout(() => {
          this._dataTransfer.$updateTotalVenta.next(Number(this.ticketVirtual.ticketVirtual.totalSale));
        }, 500);
        this.secuencia = this.totalVentaRequest.secuenciaActual;
      } else {
        this.secuencia = this.totalVentaRequest.secuenciaActual;
      }
    } else {
      this.secuencia = this.totalVentaRequest.secuenciaActual;
    }
    this._pagosMaster.reset();

    this._pagosMaster.initSecuencia(this.secuencia);

    this._dataTransfer.$setFormasDePagoInstance.next(this);

    this.formasPagoInstance.emit(this);

    /* if (this.ticketVirtual.ticketVirtual.isDevolucion) {
       const totalFavor = new Decimal(this.ticketVirtual.ticketVirtual.totalTicketFavor);
       const total = new Decimal(this.ticketVirtual.ticketVirtual.totalSale).minus(totalFavor);
       this.ticketVirtual.ticketVirtual.totalTicket = total.toNumber();
     }
 */
    if (this.ticketVirtual.ticketVirtual.isDevolucion) {
      this.totalTicketDev = new Decimal(this.ticketVirtual.ticketVirtual.totalTicket);
    }
    if (!this.ticketVirtual._pagoApartado) {
      this.totalesLast = new TotalesLast();
      this.totalesLast.totalSaleLast = Number(this.ticketVirtual.ticketVirtual.totalSale);
      this.totalesLast.totalTicketLast = Number(this.ticketVirtual.ticketVirtual.totalTicket);
      this.totalesLast.totalPaidLast = Number(this.ticketVirtual.ticketVirtual.totalPaid);
      this.totalesLast.totalChangeLast = Number(this.ticketVirtual.ticketVirtual.change);
      this.totalesLast.totalAbono = 0;
      this._pagosMaster.updateTotal(this.totalesLast);
    } else {
      this.totalesLast = new TotalesLast();
      this.totalesLast.totalSaleLast = Number(this.ticketVirtual.ticketVirtual.totalSale);
      this.totalesLast.totalPaidLast = Number(this.ticketVirtual.ticketVirtual.totalPaid);
      this.totalesLast.totalChangeLast = Number(this.ticketVirtual.ticketVirtual.change);
      this.totalesLast.totalAbono = Number(this.ticketVirtual._pagoApartado.montoPago);
      this._pagosMaster.updateTotal(this.totalesLast);
    }
  }

  ngOnDestroy() {
    this.cancelarSub.unsubscribe();
  }

  /**Método para agregar pagos */
  addPago(pagosHechos: PagosMaster) {
    
    //debugger;

    if (pagosHechos.divisas) {
      this.totalToPaidMonedaExtranjera = pagosHechos.divisas.tasaConversionVigente;
    }

    this.pagos = [];
    this.pagosBack = [];
    const pagosTotales = [];

    pagosHechos.pagos.forEach(value => {

      if (value.nombre === PagosOps.financiamento || value.nombre === PagosOps.financiamientoMayorista) {
        this.pagoFinanciamiento = true;
      }
      if (value.nombre === PagosOps.tarjetaRegalo
        || value.nombre === PagosOps.americanExpress
        || value.nombre === PagosOps.tarjetaVisa
        || value.nombre === PagosOps.tarjetaMM
        || value.nombre === PagosOps.tarjetaCreditoDebit) {
        value.nombre = value.nombre + ' ' + value.numeroTarjeta;
      }

      const pagoExists = this.pagos.find(pago => (value.nombreCompuesto || value.nombre) === (pago.nombre));

      if (!pagoExists) {
        this.pagos.push(new LineaPago(value));
      } else {
        pagoExists.addToLineaPago(value);
      }

      pagosTotales.push(value.formaDePago);
      this.pagosBack.push(value.formaDePago);


      if (value.clave === TipoPago.efectivo) {
        this._dataTransfer.$coordinadorFuncionesBotoneraPagos.next({ boton: PagosOps.efectivo, action: 'disabled', dontHidde: true });
      } else if (value.clave === TipoPago.financiamento) {
        this._dataTransfer.$coordinadorFuncionesBotoneraPagos.next({ boton: PagosOps.financiamento, action: 'disabled', dontHidde: true });
      }

      // OCG: Apagar el boton de la forma de pago "Finlag"
      if (value.clave === TipoPago.finLag) {
        this._dataTransfer.$coordinadorFuncionesBotoneraPagos.next({ boton: PagosOps.finLag, action: 'disabled', dontHidde: true });
      }


    });

    this.updateTotal(pagosTotales);
  }


  /**Método que actualiza el total despues de agregar pagos */
  updateTotal(pagos: Array<FormaPagoUtilizado>) {
    
    //debugger;

    this.ticketVirtual.ticketVirtual.totalPaid = 0;
    this.ticketVirtual.ticketVirtual.change = 0;

    let change = new Decimal(this.ticketVirtual.ticketVirtual.change);
    let totalTicket = new Decimal(this.ticketVirtual.ticketVirtual.totalTicket);
    let pagoRestanteAbono = new Decimal(0);
    let totalPaid = new Decimal(this.ticketVirtual.ticketVirtual.totalPaid);
    const totalSale = new Decimal(this.ticketVirtual.ticketVirtual.totalSale);

    if (this.ticketVirtual._pagoApartado) {

      totalTicket = new Decimal(this.ticketVirtual._pagoApartado.pagoApartado.saldo);
      this.ticketVirtual.ticketVirtual.totalTicket = totalTicket.toNumber();
      pagoRestanteAbono = new Decimal(this.Cantidad);
      this.pagoRestanteAbono = pagoRestanteAbono.toNumber();
      totalPaid = new Decimal(totalSale).minus(totalTicket);
      this.ticketVirtual.ticketVirtual.totalPaid = totalPaid.toNumber();

    } else if (this.ticketVirtual.realizarApartado) {

      pagoRestanteAbono = new Decimal(this.Cantidad);
      this.pagoRestanteAbono = pagoRestanteAbono.toNumber();
      totalTicket = new Decimal(totalSale);
      this.ticketVirtual.ticketVirtual.totalTicket = totalTicket.toNumber();

    } else if (this.ticketVirtual.ticketVirtual.isDevolucion) {

      /*const totalFavor = new Decimal(this.ticketVirtual.ticketVirtual.totalTicketFavor);
      totalPaid = totalFavor;
      totalTicketDev = new Decimal(totalSale).minus(totalFavor);
      this.ticketVirtual.ticketVirtual.totalTicket = totalTicketDev.toNumber();*/
      this.ticketVirtual.ticketVirtual.totalTicket = totalTicket.toNumber();
      this.ticketVirtual.ticketVirtual.totalPaid = totalPaid.toNumber();

    } else {

      totalTicket = new Decimal(totalSale);
      this.ticketVirtual.ticketVirtual.totalTicket = totalTicket.toNumber();

    }

    pagos.forEach(index => {
    
      const pago = new Decimal(index.importeMonedaNacional);

      if (this.ticketVirtual._pagoApartado || this.ticketVirtual.realizarApartado) {
      
        if (pagoRestanteAbono.toNumber() <= pago.toNumber()) {
      
          totalPaid = new Decimal(totalPaid).plus(pagoRestanteAbono);
          totalTicket = new Decimal(totalSale).minus(totalPaid);
          change = new Decimal(pago).minus(pagoRestanteAbono);
          pagoRestanteAbono = new Decimal(0);
          this.deshabilitarBotones('disabled', true);

        } else {
          
          totalPaid = new Decimal(totalPaid).plus(pago);
          totalTicket = new Decimal(totalSale).minus(totalPaid);
          pagoRestanteAbono = new Decimal(pagoRestanteAbono).minus(pago);
          change = new Decimal(0);

        }
      } else if (this.ticketVirtual.ticketVirtual.isDevolucion) {
        totalPaid = new Decimal(totalPaid).plus(pago);
        totalTicket = new Decimal(this.totalTicketDev).minus(totalPaid);
      } else {
        totalPaid = new Decimal(totalPaid).plus(pago);
        totalTicket = new Decimal(totalSale).minus(totalPaid);
      }

      if (totalTicket.toNumber() <= 0) {
        this.deshabilitarBotones('disabled', true);
      }
      if (totalTicket.toNumber() < 0) {
        /**Valida cambio dependiendo tipo pago*/
        if (this.checkValeTipo(index.codigoFormaPagoImporte)) {

          this.calculoCambioVales(index, totalTicket);

        } else if (index.codigoFormaPagoImporte === TipoPago.dolares || index.codigoFormaPagoImporte === TipoPago.quetzales) {

          this.calculoCambioMonedaExtranjera(index, totalTicket);

        } else if (this.ticketVirtual.ticketVirtual.isDevolucion) {

          change = totalPaid.minus(this.totalTicketDev);
          index.importeCambioMonedaNacional = change.toNumber();
          this.ticketVirtual.ticketVirtual.change = change.toNumber();

        } else {

          totalTicket = new Decimal(0);
          change = totalPaid.minus(totalSale);
          index.importeCambioMonedaNacional = change.toNumber();
          this.ticketVirtual.ticketVirtual.change = change.toNumber();

        }
        totalTicket = new Decimal(0);
        this.deshabilitarBotones('disabled', true);

      } else {
        /**Calculo de cambio para apartados*/
        if (this.ticketVirtual._pagoApartado || this.ticketVirtual.realizarApartado) {
          if (pagoRestanteAbono.toNumber() === 0) {
            if (change.toNumber() !== 0) {
              if (totalTicket.toNumber() < 0) {
                if (this.checkValeTipo(index.codigoFormaPagoImporte)) {
                  this.calculoCambioVales(index, totalTicket);
                } else if (index.codigoFormaPagoImporte === TipoPago.dolares || index.codigoFormaPagoImporte === TipoPago.quetzales) {
                  this.calculoCambioMonedaExtranjera(index, totalTicket);
                }
              } else {
                if (this.checkValeTipo(index.codigoFormaPagoImporte)) {
                  if (change.toNumber() > CambioPagos.vales) {
                    index.importeCambioExcedenteMonedaNacional = CambioPagos.vales;
                    index.importeCambioMonedaNacional = CambioPagos.vales;
                    this.ticketVirtual.ticketVirtual.change = CambioPagos.vales;
                  } else {
                    this.ticketVirtual.ticketVirtual.change = change.toNumber();
                    index.importeCambioMonedaNacional = change.toNumber();
                    index.importeCambioExcedenteMonedaNacional = 0;
                  }
                } else if (index.codigoFormaPagoImporte === TipoPago.dolares || index.codigoFormaPagoImporte === TipoPago.quetzales) {
                  let maximoCambio = 0;
                  if (index.codigoFormaPagoImporte === TipoPago.dolares) {
                    maximoCambio = new Decimal(CambioPagos.dolares).times(
                      this.totalToPaidMonedaExtranjera).toNumber();
                  } else {
                    maximoCambio = new Decimal(CambioPagos.quetzal).times(
                      this.totalToPaidMonedaExtranjera).toNumber();
                  }
                  const monto = new Decimal(pago).minus(change);
                  index.importeCambioMonedaNacional = change.toNumber();
                  this.ticketVirtual.ticketVirtual.change = change.toNumber();
                  if (Number(maximoCambio) !== 0 && change.toNumber() > Number(maximoCambio)) {
                    const cambio = new Decimal(index.importeCambioMonedaNacional).minus(maximoCambio);
                    index.importeCambioExcedenteMonedaNacional = cambio.toNumber();
                    index.importeCambioMonedaNacional = maximoCambio;
                    this.ticketVirtual.ticketVirtual.change = maximoCambio;
                  }
                } else {
                  index.importeCambioMonedaNacional = change.toNumber();
                  this.ticketVirtual.ticketVirtual.change = change.toNumber();
                }
              }
            } else {
              this.ticketVirtual.ticketVirtual.change = 0;
            }
          }
        }
      }
      this.totalesLast.totalSaleLast = this.ticketVirtual.ticketVirtual.totalSale = totalSale.toNumber();
      this.totalesLast.totalTicketLast = this.ticketVirtual.ticketVirtual.totalTicket = totalTicket.toNumber();
      this.totalesLast.totalPaidLast = this.ticketVirtual.ticketVirtual.totalPaid = totalPaid.toNumber();
      this.totalesLast.totalChangeLast = this.ticketVirtual.ticketVirtual.change;
      if (this.ticketVirtual._pagoApartado || this.ticketVirtual.realizarApartado) {
        this.totalesLast.totalAbono = this.pagoRestanteAbono = pagoRestanteAbono.toNumber();
      }
      this._pagosMaster.updateTotal(this.totalesLast);
    });
    if (this.ticketVirtual.ticketVirtual.totalPaid >= Number(this.montoPago)) {
      this.validacionApartado = true;
    } else {
      this.validacionApartado = false;
    }
  }

  /**Metodo que elimina pagos */
  eliminar(lineaPago: LineaPago) {
    this.count = 0;

    lineaPago.getIds().forEach(pagoId => {
      this._pagosMaster.deletePago(pagoId);
    });

    if (!this.ticketVirtual._pagoApartado && !this.ticketVirtual.realizarApartado) {
      this.ticketVirtual.ticketVirtual.ticketDescuentos.resetCalculo();
    }

    this._dataTransfer.$coordinadorFuncionesBotoneraPagos.next('reset');
    this.addPago(this._pagosMaster.PagosMaster);
    /*if (this.ticketVirtual.ticketVirtual.isDevolucion) {
      const totalFavor = new Decimal(this.ticketVirtual.ticketVirtual.totalTicketFavor);
      const total = new Decimal(this.ticketVirtual.ticketVirtual.totalSale).minus(totalFavor);
      this.totalesLast.totalTicketLast = total.toNumber();
    } else {*/
    this.totalesLast.totalTicketLast = Number(this.ticketVirtual.ticketVirtual.totalTicket);
    //}
    this.totalesLast.totalSaleLast = Number(this.ticketVirtual.ticketVirtual.totalSale);
    this.totalesLast.totalPaidLast = Number(this.ticketVirtual.ticketVirtual.totalPaid);
    this.totalesLast.totalChangeLast = Number(this.ticketVirtual.ticketVirtual.change);
    if (this.ticketVirtual._pagoApartado || this.ticketVirtual.realizarApartado) {
      this.totalesLast.totalAbono = this.pagoRestanteAbono;
    }
    this._pagosMaster.updateTotal(this.totalesLast);

  }

  /**Método para calcular el cambio de vales*/
  calculoCambioVales(index, totalTicket) {
    const total = new Decimal(totalTicket).negated();
    if (total.toNumber() > CambioPagos.vales) {
      this.ticketVirtual.ticketVirtual.change = CambioPagos.vales;
      index.importeCambioMonedaNacional = CambioPagos.vales;
      const num = new Decimal(totalTicket).negated();
      index.importeCambioExcedenteMonedaNacional = num.minus(
        index.importeCambioMonedaNacional);
    } else {
      this.ticketVirtual.ticketVirtual.change = total.toNumber();
      index.importeCambioMonedaNacional = total.toNumber();
      index.importeCambioExcedenteMonedaNacional = 0;
    }
  }

  /**Método para calcular el cambio de moneda  extranjera*/
  calculoCambioMonedaExtranjera(index, totalTicket) {
    let maximoCambio = 0;
    if (index.codigoFormaPagoImporte === TipoPago.dolares) {
      maximoCambio = new Decimal(CambioPagos.dolares).times(
        this.totalToPaidMonedaExtranjera).toNumber();
    } else {
      maximoCambio = new Decimal(CambioPagos.quetzal).times(
        this.totalToPaidMonedaExtranjera).toNumber();
    }
    if (index.importeMonedaNacional > totalTicket) {
      const total = new Decimal(totalTicket);
      index.importeCambioMonedaNacional = total.negated();
      const change = total.negated();
      this.ticketVirtual.ticketVirtual.change = change.toNumber();
      if (Number(maximoCambio) !== 0 && index.importeCambioMonedaNacional > Number(maximoCambio)) {
        index.importeCambioExcedenteMonedaNacional = new Decimal(index.importeCambioMonedaNacional).minus(maximoCambio);
        index.importeCambioMonedaNacional = Number(maximoCambio);
        this.ticketVirtual.ticketVirtual.change = Number(maximoCambio);
      }
    }
  }

  /**Método que cancela venta */
  cancelarVenta() {
    /**Si se cancela venta se validan tipo de pagos para que se eliminen en caso necesario */
    this.tipoA = false;
    this.tipoNA = false;
    let validacionCancelacion = false;
    if (this.pagos.length) {
      this.count = 1;
      this.pagos.forEach(index => {
        if (index.nombre === PagosOps.efectivo ||
          this.checkValeTipo(index.nombre) || index.nombre === PagosOps.monedaExtranjera) {
          this.tipoA = true;
        } else {
          this.tipoNA = true;
        }
      });
      if (this.tipoA) {
        this._alertService.show({
          tipo: 'info',
          titulo: 'Milano',
          mensaje: 'Favor de eliminar los pagos antes de cancelar'
        });
        this.count = 0;
        return;
      }
    } else {
      validacionCancelacion = true;
      this.count = 0;
    }
    if (!this.ticketVirtual._pagoApartado) {
      if (validacionCancelacion && !this.tipoNA) {
        this.ticketVirtual.returnTicket();
      } else if (this.tipoNA) {
        return;
      } else {
        this._dataTransfer.$anularTransaccionData.next(this.finalizarVentaRequest);
        this.ticketVirtual.cancelarTicket(true);
      }
    } else {
      this._dataTransfer.$anularTransaccionData.next(this.finalizarVentaRequest);
      this.ticketVirtual.cancelarTicket(true);
    }
  }

  /**Método para calcular total apartado */
  totalApartado() {
    this.ticketVirtual.ticketVirtual.totalSale = Number(this.ticketVirtual._pagoApartado.pagoApartado.importeApartadoNeto);
    this.ticketVirtual.ticketVirtual.totalPaid = Number(this.ticketVirtual._pagoApartado.pagoApartado.importePagado);
    this.ticketVirtual.ticketVirtual.totalTax = Number(this.ticketVirtual._pagoApartado.pagoApartado.importeApartadoImpuestos);
    this.ticketVirtual.ticketVirtual.totalTicket = Number(this.ticketVirtual._pagoApartado.pagoApartado.saldo);
    const busquedaClienteRequest = new ClienteRequest({
      nombre: '',
      telefono: '',
      codigoCliente: this.ticketVirtual._pagoApartado.pagoApartado.codigoCliente
    });

    this.ventaService.ClienteService(busquedaClienteRequest).subscribe(
      response => {
        if (response.length) {
          this.cliente = response[0].nombre.toUpperCase() + ' ' +
            response[0].apellidoPaterno.toUpperCase() + ' ' +
            response[0].apellidoMaterno.toUpperCase();
        } else {
          this._alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Cliente no encontrado.' });
        }
      }
    );
    if (this.ticketVirtual._pagoApartado.tipoBusqueda === TipoApartado.Abono) {
      this.BotonPago = BotonesPagos.LiquidarApartados;
    }
  }

  /**Método para limpiar ticketVirtual */
  resetTicket() {

    /*
    if (this.ticketVirtual.tipoVenta === TipoVenta.VentaEmpleado || this.ticketVirtual.tipoVenta === TipoVenta.VentaMayorista) {
      this.ticketVirtual.resetTicket();
      this._dataTransfer.$showFormasPago.next();
      this.router.navigate(['/POS']).then();
    } else {
      this.ticketVirtual.resetTicket();
      this._dataTransfer.$showFormasPago.next();
    }
    */
    /** siempre debe regresar a ventaRegular **/

    this.ticketVirtual.resetTicket();
    this._dataTransfer.$showFormasPago.next();
    this.router.navigate(['/POS']).then();


    this.pagoApartado = null;
    this.pagos = [];
    this.Cantidad = 0;
    this.totalVenta = null;
    this.totalVentaRequest = null;
    this.ticketVirtual._pagoApartado = null;
    this.pagosBack = [];
    this._pagosMaster.reset();
    this.ticketVirtual.focusOnSkuInput();
  }

  /**Método que calcula monto minimo a pagar en apartado */
  calcularMinimo() {
    this.montoPago = 0;
    this.porcentajeApartado = Number(this.ticketVirtual.ticketVirtual.totalSale) *
      (this._configService.currentConfig.montoMinimoPorcentajeApartado / 100);
    this.montoApartado = this._configService.currentConfig.montoMinimoAbonoApartado;
    if (this.porcentajeApartado >= this.montoApartado) {
      this.montoPago = Number(this.porcentajeApartado);
      if (this.ticketVirtual.ticketVirtual.totalPaid >= this.porcentajeApartado) {
        this.validacionApartado = true;
        this.deshabilitarBotones('disabled', true);
        return;
      } else {
        if (this.SelectPlazo) {
          this.validacionApartado = false;
          this._alertService.show({
            tipo: 'info',
            titulo: 'Milano',
            mensaje: 'El monto mínimo para realizar el apartado es de $' + this.montoPago
          });
        } else {
          return;
        }
      }
    } else {
      this.montoPago = Number(this.montoApartado);
      if (this.ticketVirtual.ticketVirtual.totalPaid >= this.montoApartado) {
        this.validacionApartado = true;
        this.deshabilitarBotones('disabled', true);
      } else {
        if (this.SelectPlazo) {
          this.validacionApartado = false;
          this._alertService.show({
            tipo: 'info',
            titulo: 'Milano',
            mensaje: 'El monto mínimo para realizar el apartado es de $' + this.montoPago
          });
        } else {
          return;
        }
      }
    }

  }

  /** Se actualizan variables dependiendo tipo de venta*/
  updateVenta() {
    /**Se crear variable para finalizar venta */
    if (this.ticketVirtual._pagoApartado) {
      this.apartadoRequest.folioApartado = this.ticketVirtual._pagoApartado.pagoApartado.folioApartado;
      this.apartadoRequest.formasPagoUtilizadas = this.pagosBack;
      this.apartadoRequest.codigoTipoCabeceraApartado = TipoCabeceraTotalizar.apartado;
      this.apartadoRequest.codigoTipoDetalleApartado = TipoDetalleVenta.apartado;
      this.apartadoRequest.importePagado = this.ticketVirtual.ticketVirtual.totalPaid;
      this.apartadoRequest.saldo = this.ticketVirtual.ticketVirtual.totalTicket;

      if (this.ticketVirtual.ticketVirtual.totalSale <= this.ticketVirtual.ticketVirtual.totalPaid) {
        this.apartadoRequest.importePagado = Number(this.ticketVirtual.ticketVirtual.totalPaid);
        this.apartadoRequest.apartadoLiquidado = true;
        this.apartadoRequest.saldo = 0;
      }
    } else if (this.ticketVirtual.realizarApartado) {
      this.finalizarVentaRequest.folioVenta = this.totalVenta.folioApartado;
      this.finalizarVentaRequest.lineasConDigitoVerificadorIncorrecto = this.ticketVirtual.ticketVirtual.getLineasDigitoVerificador();
      this.finalizarVentaRequest.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.apartado;
      this.finalizarVentaRequest.formasPagoUtilizadas = this.pagosBack;
      this.finalizarVentaRequest.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
      this.finalizarVentaRequest.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };
    } else if (this.totalVentaRequest && this.totalVentaRequest.cabeceraVentaAsociada.codigoTipoCabeceraVenta === TipoCabeceraTotalizar.tiempoAire) {
      this.finalizarVentaRequest.folioVenta = this.totalVenta.folioOperacion;
      this.finalizarVentaRequest.lineasTiempoAire = this.totalVentaRequest.articulos;
      this.finalizarVentaRequest.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.tiempoAire;
      this.finalizarVentaRequest.formasPagoUtilizadas = this.pagosBack;
      this.finalizarVentaRequest.lineasConDigitoVerificadorIncorrecto = this.ticketVirtual.ticketVirtual.getLineasDigitoVerificador();
      this.finalizarVentaRequest.cabeceraVentaAsociada = this.totalVentaRequest.cabeceraVentaAsociada;
      this.finalizarVentaRequest.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
      this.finalizarVentaRequest.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };
    } else if (this.ticketVirtual.isPagoMayorista) {
      this.finalizarVentaRequest.cabeceraVentaAsociada = this.totalVentaRequest.cabeceraVentaAsociada;
      this.finalizarVentaRequest.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.ventaRegular;
      this.finalizarVentaRequest.folioVenta = this.totalVenta.folioOperacion;
      this.finalizarVentaRequest.formasPagoUtilizadas = this.pagosBack;
      this.finalizarVentaRequest.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
      this.finalizarVentaRequest.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };
    } else {
      this.finalizarVentaRequest.folioVenta = this.totalVenta.folioOperacion;
      this.finalizarVentaRequest.lineasConDigitoVerificadorIncorrecto = this.ticketVirtual.ticketVirtual.getLineasDigitoVerificador();
      this.finalizarVentaRequest.codigoTipoCabeceraVenta = this.totalVentaRequest.cabeceraVentaAsociada.codigoTipoCabeceraVenta;
      this.finalizarVentaRequest.formasPagoUtilizadas = this.pagosBack;
      this.finalizarVentaRequest.cabeceraVentaAsociada = this.totalVentaRequest.cabeceraVentaAsociada;
      this.finalizarVentaRequest.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
      this.finalizarVentaRequest.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };
    }

    if (this.ticketVirtual.ticketVirtual.totalTicket === 0 && this.ticketVirtual._pagoApartado) {
      this.deshabilitarBotones('disabled', true);
      this.BotonPago = BotonesPagos.LiquidarApartados;
    }
    if (!this.ticketVirtual._pagoApartado && this.ticketVirtual.realizarApartado) {
      this.calcularMinimo();
    }
  }

  /**Validacion de tipo de vale*/
  checkValeTipo(valeName: string) {

    if (TipoPago.valeV1 === valeName ||
      TipoPago.valeV2 === valeName ||
      TipoPago.valeV3 === valeName ||
      TipoPago.valeV4 === valeName ||
      TipoPago.valeV5 === valeName ||
      TipoPago.valeV6 === valeName ||
      TipoPago.valeV7 === valeName ||
      TipoPago.valeV8 === valeName ||
      TipoPago.valeV9 === valeName ||
      PagosOps.valeV1 === valeName ||
      PagosOps.valeV2 === valeName ||
      PagosOps.valeV3 === valeName ||
      PagosOps.valeV4 === valeName ||
      PagosOps.valeV5 === valeName ||
      PagosOps.valeV6 === valeName ||
      PagosOps.valeV7 === valeName ||
      PagosOps.valeV8 === valeName ||
      PagosOps.valeV9 === valeName
    ) {
      return true;
    }
    return false;
  }


  /**Modal para finalizar la venta */
  finalizarVenta() {
    //debugger;
    this.disabledEnter = true;
    if (this.ticketVirtual.ticketVirtual.totalTicket > 0) {
      this.modalRef = this.modalService.show(this.finalizarTemplate, { backdrop: 'static', keyboard: false, 'class': 'modal-dialogCenter' });
    } else {
      if (!this.finalizarVentaRequest.informacionFoliosTarjeta) {
        let exiteTarjeta = false;
        this.finalizarVentaRequest.informacionFoliosTarjeta = [];
        this.ticketVirtual.ticketVirtual.ticketRow.forEach(item => {
          if (item.lineaTicket.articulo.esTarjetaRegalo) {
            exiteTarjeta = true;
            this.numeroTarjetas++;
            const infoTarjeta = new InformacionFoliosTarjeta();
            infoTarjeta.sku = item.lineaTicket.articulo.sku;
            const initialState = {
              ticketVirtualInstance: this.ticketVirtual, finalizarVenta: infoTarjeta,
              pagosInstance: this, precioTarjeta: item.lineaTicket.articulo.precioConImpuestos
            };
            this.modalRef = this.modalService.show(VentaTarjetaRegaloComponent, { backdrop: 'static', keyboard: false, initialState });
            this.finalizarVentaRequest.informacionFoliosTarjeta.push(infoTarjeta);
          }
        });
        if (!exiteTarjeta) {
          this.confirmFinalizarVenta();
        }
      } else {
        if (this.incremNumeroTarjetas === this.numeroTarjetas) {
          this.confirmFinalizarVenta();
        }
      }
    }
  }

  /**Método para finalizar la venta */
  confirmFinalizarVenta() {
    this.disabledEnter = true;
    this.updateVenta();
    if (this.ticketVirtual._pagoApartado) {
      if (Number(this.pagoRestanteAbono) !== 0) {
        this._alertService.show({ tipo: 'info', titulo: 'Mensaje', mensaje: 'Debe cubrir el total del abono' });
        return;
      } else {
        this.ventaService.AbonarApartadoService(this.apartadoRequest).subscribe(
          data => {
            this.disabledEnter = false;
            if (Number(data.codeNumber) !== 349 && Number(data.codeNumber) !== 350) {
              this._alertService.show({ tipo: 'error', titulo: 'Milano', mensaje: data.codeDescription });
              return;
            } else {
              if (this.apartadoRequest.apartadoLiquidado) {
                this._alertService.show({ tipo: 'success', titulo: 'Milano', mensaje: data.codeDescription });
                this.resetTicket();
                if (data.informacionAsociadaRetiroEfectivo) {
                  if (data.informacionAsociadaRetiroEfectivo.mostrarAlertaRetiroEfectivo) {
                    this.retiroEfectivoModal(data.informacionAsociadaRetiroEfectivo);
                  }
                }
              } else {
                this._alertService.show({ tipo: 'success', titulo: 'Milano', mensaje: data.codeDescription });
                this.resetTicket();
                if (data.informacionAsociadaRetiroEfectivo) {
                  if (data.informacionAsociadaRetiroEfectivo.mostrarAlertaRetiroEfectivo) {
                    this.retiroEfectivoModal(data.informacionAsociadaRetiroEfectivo);
                  }
                }
              }
            }
          }
        );
      }
    } else {
      //debugger;
      this.count = 2;
      if (this.ticketVirtual.tipoVenta === TipoVenta.VentaMayorista || this.ticketVirtual.ticketVirtual.isDevolucion &&
        this.totalVentaRequest.cabeceraVentaAsociada.codigoTipoCabeceraVenta === TipoCabeceraTotalizar.ventaMayorista) { // se emlimina chequeo para ventaEmpleado issue 381
        //OCG: Se quita la validacion para devoluciones mayorista
          //if (this.pagoFinanciamiento) {
          this.ventaService.FinalizarVentaService(this.finalizarVentaRequest).subscribe(
            data => {
              this.disabledEnter = false;
              this.count = 0;
              if (Number(data.codeNumber) === 332 || Number(data.codeNumber) === 399) {
                this._alertService.show({ tipo: 'success', titulo: 'Mensaje', mensaje: data.codeDescription });
                this.resetTicket();
                if (data.informacionAsociadaRetiroEfectivo) {
                  if (data.informacionAsociadaRetiroEfectivo.mostrarAlertaRetiroEfectivo) {
                    this.retiroEfectivoModal(data.informacionAsociadaRetiroEfectivo);
                  }
                }
              } else {
                this._alertService.show({ tipo: 'error', titulo: 'Mensaje', mensaje: data.codeDescription });
                return;
              }
            }
          );
        // } else {
        //   this.count = 0;
        //   this._alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Debe realizar el pago con finaciamiento' });
        //   return;
        // }
      } else {
        //console.log(`Finalizando venta... `);
        this.ventaService.FinalizarVentaService(this.finalizarVentaRequest).subscribe(
          data => {
            this.disabledEnter = false;
            this.count = 0;
            if (Number(data.codeNumber) === 332 || Number(data.codeNumber) === 399) {
              this._alertService.show({ tipo: 'success', titulo: 'Mensaje', mensaje: data.codeDescription });
              this.resetTicket();
              if (data.informacionAsociadaRetiroEfectivo) {
                if (data.informacionAsociadaRetiroEfectivo.mostrarAlertaRetiroEfectivo) {
                  this.retiroEfectivoModal(data.informacionAsociadaRetiroEfectivo);
                }
              }
            } else {
              this._alertService.show({ tipo: 'error', titulo: 'Mensaje', mensaje: data.codeDescription });
              return;
            }
          });
      }
    }
    if (this.modalRef) {
      this.closeModalFinalizar();
    }
  }

  /**Método q valida pago minimo en creacion de apartado*/
  validaPago() {
    if (this.SelectPlazo && Number(this.Cantidad) >= Number(this.montoPago) &&
      Number(this.Cantidad) < this.ticketVirtual.ticketVirtual.totalTicket) {
      this.totalesLast.totalSaleLast = this.ticketVirtual.ticketVirtual.totalSale;
      this.totalesLast.totalTicketLast = this.Cantidad;
      this.totalesLast.totalPaidLast = Number(this.ticketVirtual.ticketVirtual.totalPaid);
      this.totalesLast.totalChangeLast = Number(this.ticketVirtual.ticketVirtual.change);
      this.totalesLast.totalAbono = 0;
      this._pagosMaster.updateTotal(this.totalesLast);
      return true;
    } else {
      return false;
    }
  }

  /**Método para finalizar creacion de apartado */
  crearApartado() {
    this.disabledEnter = true;
    if (this.ticketVirtual.ticketVirtual.totalPaid < Number(this.Cantidad)) {
      this._alertService.show({ tipo: 'info', titulo: 'Mensaje', mensaje: 'Debe cubrir el total del abono' });
      return;
    } else {
      if (!this.crearApartadoRequest.informacionFoliosTarjeta) {
        let exiteTarjeta = false;
        this.ticketVirtual.ticketVirtual.ticketRow.forEach(item => {
          this.crearApartadoRequest.informacionFoliosTarjeta = [];
          if (item.lineaTicket.articulo.esTarjetaRegalo) {
            exiteTarjeta = true;
            this.numeroTarjetas++;
            const infoTarjeta = new InformacionFoliosTarjeta();
            infoTarjeta.sku = item.lineaTicket.articulo.sku;
            const initialState = {
              ticketVirtualInstance: this.ticketVirtual, finalizarVenta: infoTarjeta,
              pagosInstance: this, precioTarjeta: item.lineaTicket.articulo.precioConImpuestos, apartado: true
            };
            this.modalRef = this.modalService.show(VentaTarjetaRegaloComponent, { backdrop: 'static', keyboard: false, initialState });
            this.crearApartadoRequest.informacionFoliosTarjeta.push(infoTarjeta);
          }
        });
        if (!exiteTarjeta) {
          this.crearApartadoRequest.folioApartado = this.totalVenta.folioOperacion;
          this.crearApartadoRequest.codigoTipoCabeceraApartado = TipoCabeceraTotalizar.apartado;
          this.crearApartadoRequest.codigoTipoDetalleApartado = TipoDetalleVenta.apartado;
          this.crearApartadoRequest.diasVencimiento = this.SelectPlazo;
          this.crearApartadoRequest.formasPagoUtilizadas = this.pagosBack;
          this.crearApartadoRequest.lineasConDigitoVerificadorIncorrecto = this.totalVenta.lineasConDigitoVerificadorIncorrecto;
          this.crearApartadoRequest.importePagado = this.ticketVirtual.ticketVirtual.totalPaid;
          this.crearApartadoRequest.saldo = this.ticketVirtual.ticketVirtual.totalTicket;
          this.ventaService.CrearApartadoService(this.crearApartadoRequest).subscribe(
            data => {
              this.disabledEnter = false;
              if (Number(data.codeNumber) !== 342) {
                this._alertService.show({ tipo: 'error', titulo: 'Mensaje', mensaje: data.codeDescription });
                this.pagosBack = [];
                return;
              } else {
                this._alertService.show({ tipo: 'success', titulo: 'Mensaje', mensaje: data.codeDescription });
                this.resetTicket();
                if (data.informacionAsociadaRetiroEfectivo) {
                  if (data.informacionAsociadaRetiroEfectivo.mostrarAlertaRetiroEfectivo) {
                    this.retiroEfectivoModal(data.informacionAsociadaRetiroEfectivo);
                  }
                }
              }
            });
        }
      } else {
        if (this.incremNumeroTarjetas === this.numeroTarjetas) {
          this.crearApartadoRequest.folioApartado = this.totalVenta.folioOperacion;
          this.crearApartadoRequest.codigoTipoCabeceraApartado = TipoCabeceraTotalizar.apartado;
          this.crearApartadoRequest.codigoTipoDetalleApartado = TipoDetalleVenta.apartado;
          this.crearApartadoRequest.diasVencimiento = this.SelectPlazo;
          this.crearApartadoRequest.formasPagoUtilizadas = this.pagosBack;
          this.crearApartadoRequest.lineasConDigitoVerificadorIncorrecto = this.totalVenta.lineasConDigitoVerificadorIncorrecto;
          this.crearApartadoRequest.importePagado = this.ticketVirtual.ticketVirtual.totalPaid;
          this.crearApartadoRequest.saldo = this.ticketVirtual.ticketVirtual.totalTicket;
          this.ventaService.CrearApartadoService(this.crearApartadoRequest).subscribe(
            data => {
              if (Number(data.codeNumber) !== 342) {
                this._alertService.show({ tipo: 'error', titulo: 'Mensaje', mensaje: data.codeDescription });
                this.pagosBack = [];
                return;
              } else {
                this._alertService.show({ tipo: 'success', titulo: 'Mensaje', mensaje: data.codeDescription });
                this.resetTicket();
                if (data.informacionAsociadaRetiroEfectivo) {
                  if (data.informacionAsociadaRetiroEfectivo.mostrarAlertaRetiroEfectivo) {
                    this.retiroEfectivoModal(data.informacionAsociadaRetiroEfectivo);
                  }
                }
              }
            });
        }
      }
    }
  }

  /**Método para setear plazo del apartado */
  enviarPlazo(Plazo) {
    this.SelectPlazo = Plazo;
  }

  /**Método para cerrar el diálogo*/
  closeModal() {
    if (this.SelectPlazo && Number(this.Cantidad) >= Number(this.montoPago) &&
      Number(this.Cantidad) < this.ticketVirtual.ticketVirtual.totalTicket) {
      this._dataTransfer.$updateTotalVenta.next(Number(this.Cantidad));
      this.modalRef.hide();
    } else {
      return;
    }
  }

  /**Método para cerrar el diálogo de template finalziar incompleta la venta*/
  closeModalFinalizar() {
    this.modalRef.hide();
  }

  /**Deshabilita botones de pago */
  deshabilitarBotones(tipoAction, hideFocus) {

    const bloqueaBtn = actions => {
      [].forEach.call(actions, action => {
        this._dataTransfer.$coordinadorFuncionesBotoneraPagos.next(action);
      });
    };

    bloqueaBtn([{ boton: PagosOps.efectivo, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.financiamento, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.masFunciones, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.monedaExtranjera, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.notaCredito, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.tarjetaCreditoDebit, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.tarjetaMM, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.tarjetaRegalo, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.vales, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.americanExpress, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.tarjetaVisa, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.tarjetaCreditoDebit2, action: tipoAction, dontHidde: hideFocus }, //OCG
    { boton: PagosOps.finLag, action: tipoAction, dontHidde: hideFocus },
    { boton: PagosOps.cupones, action: tipoAction, dontHidde: hideFocus }]);
  }

  retiroEfectivoModal(informacionRetiro) {


    /*if (this.ticketVirtual.modalRef) {

      setTimeout(() => this.ticketVirtual.modalRef.hide(), 500);

      this.modalService.onHide.take(1).subscribe(
        () => {
          this.informacionRetiro = informacionRetiro;
          if (informacionRetiro.permitirIgnorarAlertaRetiroEfectivo) {
            this.mensajeRetiro = 'El monto de efectivo supera al máximo permitido';
            this.modalRef = this.modalService.show(this.retiroEfectivo, {
              'class': 'modal-dialogCenter',
              backdrop: 'static',
              keyboard: false
            });
            this.cerrar = false;
          } else {
            this.mensajeRetiro = 'El monto de efectivo supera al máximo permitido ¿Desea retirar efectivo?';
            this.modalRef = this.modalService.show(this.retiroEfectivo, {
              'class': 'modal-dialogCenter',
              backdrop: 'static',
              keyboard: false
            });
            this.cerrar = true;
          }
        });

    } else {*/

    this.informacionRetiro = informacionRetiro;
    if (informacionRetiro.permitirIgnorarAlertaRetiroEfectivo) {
      this.mensajeRetiro = 'El monto de efectivo supera al máximo permitido';
      this.modalRef = this.modalService.show(this.retiroEfectivo, { 'class': 'modal-dialogCenter', backdrop: 'static', keyboard: false });
      this.cerrar = false;
    } else {
      this.mensajeRetiro = 'El monto de efectivo supera al máximo permitido ¿Desea retirar efectivo?';
      this.modalRef = this.modalService.show(this.retiroEfectivo, { 'class': 'modal-dialogCenter', backdrop: 'static', keyboard: false });
      this.cerrar = true;
    }


    // }

  }

  closeModalRetiro() {
    this.generalService.ignorarRetiroService().subscribe(data => {
      if (Number(data.codeNumber) === 367) {
        this.modalRef.hide();
        this.ticketVirtual.seleccionaVendedor();
      } else {
        this._alertService.show({ tipo: 'error', titulo: 'Mensaje', mensaje: data.codeDescription });
      }
    });
  }

  retirarEfectivoConfirm() {
    this.modalService.onHide.take(1).subscribe(
      () => {
        return new SudoCallbackFactory({
          component: this,
          ModalLevel: 1,
          passthroughAdmin: true,
          callBack: 'confirmCredenciales',
          modalService: this.modalService,
          backdrop: 'static',
          staticMode: true,
          keyboard: false
        });
      });
    this.closeModalFinalizar();
  }

  confirmCredenciales() {
    const initialState = { informacionRetiro: this.informacionRetiro, ticketVirtualInstance: this.ticketVirtual };
    this.modalRef = this.modalService.show(RetiroParcialEfectivoComponent, {
      class: 'modal-md', backdrop: 'static', keyboard: false,
      initialState
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    const keyCode = event.which || event.keyCode;

    if ((keyCode === 13 || event.key === 'Enter') && this.pagos.length && !this.disabledEnter) {
      if (this.validacionApartado) {

        setTimeout(() => {
          this.crearApartado(); // para evitar que se encime con evento de ventana modal
        }, 1000);

      } else if (this.ticketVirtual._pagoApartado) {
        if (Number(this.pagoRestanteAbono) === 0) {
          this.confirmFinalizarVenta();
        }
      } else {
        if (this.ticketVirtual.ticketVirtual.totalTicket === 0) {
          this.finalizarVenta();
        }
      }
    }
  }

  selectRowUp() {


    const lastRow = this.pagos.length - 1;

    if (this.currentSelection === 0) {
      this.currentSelection = lastRow;
    } else if (this.currentSelection >= 0) {
      this.currentSelection--;
    } else {
      this.currentSelection = 0;
    }
  }

  selectFirstRow() {
    this.currentSelection = 0;
  }

  selectRowDown() {

    const lastRow = this.pagos.length - 1;

    if (this.currentSelection === lastRow) {
      this.currentSelection = 0;
    } else if (this.currentSelection >= 0) {
      this.currentSelection++;
    } else {
      this.currentSelection = 0;
    }
  }

  isLastRow(): boolean {
    const lastRow = this.pagos.length - 1;
    return lastRow === this.currentSelection;
  }

  isFirstRow(): boolean {
    return this.currentSelection === 0;
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { AlertService } from '../../../services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MovimientoTarjetaRequest } from '../../../Models/Pagos/MovimientoTarjeta';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';
import { SalesService } from '../../../services/sales.service';
import { PagosMasterService } from '../../../services/pagos-master.service';
import { ClasificacionVenta, EstadosPago, OrigenPago, PagosOps, TipoPago, TipoPagoAccesoBoton } from '../../../shared/GLOBAL';
import { VentaTarjetaRequest } from '../../../Models/Pagos/VentaTarjetaRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { RetiroTarjetaRequest } from '../../../Models/Pagos/RetiroTarjetaRequest';
import { PuntosTarjetaRequest } from '../../../Models/Pagos/PuntosTarjetaRequest';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import { DescuentoPromocionalLineaModel } from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import { DescuentoPromocionalVentaModel } from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import { Decimal } from 'decimal.js';
import { DescuentoPromocionalAplicado } from '../../../Models/Sales/DescuentoPromocionalAplicado';
import { DosDecimalesPipe } from '../../../pipes/dos-decimales.pipe';
import { ConfiguracionMSI } from '../../../Models/BBVAv2/ConfiguracionMSI';
import { ConfiguracionMSIResponse } from '../../../Models/BBVAv2/ConfiguracionMsiResponse';
import { Bbvav2Service } from '../../../services/bbvav2.service';
import { SaleRequest } from '../../../Models/BBVAv2/SaleRequest';
import { CardDataResponse } from '../../../Models/BBVAv2/CardDataResponse';
import { CardData } from '../../../Models/BBVAv2/CardData';
import { SaleResponse } from '../../../Models/BBVAv2/SaleResponse';
import { PasosPago } from '../../../Models/BBVAv2/PasosPago';
import { CardMSIConfig } from '../../../Models/BBVAv2/CardMSIConfig';
import { MsiList } from '../../../Models/BBVAv2/MsiList';

@Component({
  selector: 'app-pago-tarjeta-credito-debito2',
  templateUrl: './pago-tarjeta-credito-debito2.component.html',
  styleUrls: ['./pago-tarjeta-credito-debito2.component.css'],
  providers: [SalesService, DosDecimalesPipe, Bbvav2Service]
})
export class PagoTarjetaCreditoDebito2Component implements OnInit {
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  tipoPago = TipoPagoAccesoBoton.tarjetaCreditoDebit;
  recibido: Number;
  Confirmacion: number;
  totalToPay = 0;
  tarjetaNumero: number;
  folioVenta: string;
  toDisable: boolean;
  movimientoTarjeta: MovimientoTarjetaRequest;
  cargando: boolean;
  importeCashBack: number;
  mensajeTarjeta: string;
  tarjetaCredito: boolean;
  modalRef: BsModalRef;
  showMovimientoExtra: boolean;
  cashBack: boolean;
  pago: PagosToDisplay;
  toDisabled: boolean;
  puntosBancomer: boolean;
  cancelarMovimiento: boolean;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Number;
  //#region Instancias de clases BBVA2

  configuracionMSIResponse: ConfiguracionMSIResponse;
  saleRequest: SaleRequest;
  saleResponse: SaleResponse;
  cardResponse: CardDataResponse;
  pasosPago: PasosPago;
  cardMSIConfig: CardMSIConfig;
  mesesSeleccionados:string = "1";

  //#endregion
  constructor(private modalService: BsModalService, private alertService: AlertService, private _salesService: SalesService,
    public _pagosMaster: PagosMasterService, private dosDecimales: DosDecimalesPipe
    , private _bbvav2: Bbvav2Service) { }

  ngOnInit() {

    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast);
    this.recibido = this.dosDecimales.calc(this.totalToPay);
    this.toDisable = true;
    this.movimientoTarjeta = new MovimientoTarjetaRequest();
    this.cancelarMovimiento = false;

    this.saleRequest = new SaleRequest();
    this.configuracionMSIResponse = new ConfiguracionMSIResponse();
    this.pasosPago = new PasosPago();

  }

  cancelPay() {
    if (this.cancelarMovimiento) {
      this._salesService.procesarMovimientoTarjetaBancariaCancelar(this.movimientoTarjeta).subscribe(resp => {
        if (Number(resp.codeNumber) === 0) {
          this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Se Canceló Movimiento Exitosamente' });
          this.closeModal();
        } else {
          this.alertService.show({ titulo: 'Error', tipo: 'error', mensaje: resp.codeDescription });
          this.toDisable = true;
          return;
        }
      });
    } else {
      this.closeModal();
    }
  }

  closeModal() {
    this.formasPagoMenu.closeModal();
  }

  validatePay() {
    if (!this.recibido || Number(this.recibido) === 0 || Number(this.recibido) <= 0) {
      return false;
    } else {
      return true;
    }
  }

  // 
  CardReader() {

 
      if (Number(this.recibido) === 0 || Number(this.recibido) <= 0){
        this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto' });
        return;
      }
  
      if (Number(this.recibido) > this.totalToPay) {
        this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Monto mayor al total a pagar' });
      return;
      }

    debugger
    this.validatePay();

    this.saleRequest.transactionAmount = this.recibido.toString();
    this.saleRequest.amex = false;
    this.saleRequest.dollars = false;
    this.saleRequest.payPoints = false; 
    this.saleRequest.promo = this.mesesSeleccionados; 

//#region Se define el origen de pago, sin cambios
switch (this.formasPagoMenu.origenPago) {
  case OrigenPago.normal:
    this.saleRequest.merchanReference = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
    break;
  case OrigenPago.apartado:
    this.saleRequest.merchanReference = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
    break;
}
//#endregion

    


    


    this.cargando = true;

    // Identificar los datos de la tarjeta
    this._bbvav2.ServiceReadCard(this.saleRequest).subscribe(resp => {
      this.cardMSIConfig = { ...resp }
      
      //console.log(`this.cardMSIConfig: ${JSON.stringify(this.cardMSIConfig)}`)
    }, (error) => {
      this.cancelPay();
      this.closeModal();
      return;

    }, () => {

      debugger;
      if (this.cardMSIConfig.card.producto == "c") {
        //Verificar si los meses sin intereses estan activos
          this.pasosPago.verPasoUno = false;

          if (this.recibido >= this.cardMSIConfig.configMSI.montoMinimoVisa
             && this.cardMSIConfig.configMSI.mesesSinInteresesVisa > 1
            && this.cardMSIConfig.card.producto == "c"
          ) {
            this.pasosPago.verPasoDos = true;
          } else {
            this.pasosPago.verPasoDos = false;
             this.PagaMSI("1");
          }

      }else{
        this.pasosPago.verPasoDos = false;
        this.pasosPago.verPasoTres = false;
        this.Pay(false);
      }
    });
  }

  PagaMSI(opcion: string = "1") {

    // Opción 3: Meses sin intereses
    if (opcion == "3") {
      this.saleRequest.promo = this.mesesSeleccionados;
    }else{
      this.saleRequest.promo = opcion;
    }
 
    this.pasosPago.verPasoDos = false;
 //debugger; Solo para tarjetas de crédito emisor bbva (12) y que no seleccionen meses se permite pagar con puntos.
    if (this.cardMSIConfig.card.producto == "c" && this.cardMSIConfig.card.emisor == "12" && this.mesesSeleccionados == "1") 
    {
      this.pasosPago.verPasoTres = true;
    }
    else
    {
      this.Pay(false);
    }
  }

  Pay(puntos:boolean) {
    //debugger;
    this.pasosPago.verPasoDos = false;
    this.pasosPago.verPasoTres = false;
    this.saleRequest.payPoints = puntos;
    this.saleRequest.transactionAmount = this.recibido.toString();
    //this.saleRequest.merchanReference = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;

//     //#region Se define el origen de pago, sin cambios
// switch (this.formasPagoMenu.origenPago) {
//   case OrigenPago.normal:
//     this.saleRequest.merchanReference = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
//     break;
//   case OrigenPago.apartado:
//     this.saleRequest.merchanReference = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
//     break;
// }
// //#endregion
    
    //console.log(`Pagar con puntos: ${this.saleRequest.payPoints}`);
    //console.log(`Ticket Vistual: ${this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion}`);
    //console.log(`this.saleRequest: ${JSON.stringify(this.saleRequest)}`);
 
 
    this._bbvav2.ServiceCompleteSale(this.saleRequest).subscribe(resp => {
      this.saleResponse = { ...resp }
      //console.log(JSON.stringify(this.saleResponse))
    }, (error) => {
      //console.log(error);
      this.cancelPay();
      this.closeModal();
      return;
      
    }, () => {

      // Validar la respuesta regresada por la pipad, esta debe de ser autorizada
      // se regresa un número de autorización
      //debugger;
      // &&
      if (this.saleResponse.numeroAutorizacion && this.saleResponse.numeroAutorizacion != "" && this.saleResponse.codigoRespuesta == "00" && this.saleResponse.numeroAutorizacion.substring(this.saleResponse.numeroAutorizacion.length - 6) != "000000" && this.saleResponse.leyenda.toUpperCase().includes("APROBADA")) 
      {
        this.addPay();       
      }
      else{
        this.alertService.show({ tipo: 'error', titulo: 'Milano', mensaje: this.saleResponse.leyenda });
        this.cancelPay();
        this.closeModal();
        return;
      }

    });

  }

  addPay() {
    debugger;
    this.toDisable = false;
    
    if (!this.recibido) {
      this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto' });
      this.toDisable = true;
      return;
    } else {
      if (Number(this.recibido) === 0 || Number(this.recibido) <= 0) {
        this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto válido' });
        this.toDisable = true;
        return;
      } else {
        const recibido = Number(this.recibido);
        this.movimientoTarjeta.venta = new VentaTarjetaRequest();
        this.movimientoTarjeta.venta.codigoFormaPagoImporte = TipoPago.tarjetaCreditoDebit;
        this.movimientoTarjeta.venta.estatus = EstadosPago.Registrado;
        switch (this.formasPagoMenu.origenPago) {
          case OrigenPago.normal:
            this.movimientoTarjeta.venta.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
            this.movimientoTarjeta.venta.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.tarjetaCmm:
            this.movimientoTarjeta.venta.folioOperacionAsociada = '';
            this.movimientoTarjeta.venta.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.apartado:
            this.movimientoTarjeta.venta.folioOperacionAsociada =
              this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
            this.movimientoTarjeta.venta.clasificacionVenta = ClasificacionVenta.apartado;
            break;
        }
        this.movimientoTarjeta.venta.importeVentaTotal = recibido;
        this.movimientoTarjeta.venta.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
        this.movimientoTarjeta.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
        this.movimientoTarjeta.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };

        if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones && (this.totalAplicandoPromociones == recibido) ) {

          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);

          this.movimientoTarjeta.descuentosPromocionalesPorVentaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
              return descuentoAplicado;
            })
          };

          this.movimientoTarjeta.descuentosPromocionalesPorLineaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
              return descuentoAplicado;
            })
          };
        }

        if (Number(this.recibido) <= this.totalToPay) {

          this.cargando = true;

          //#region OCG: Definir las parcialidades, peticiones y datos de tarjeta para el POS
          //debugger;
          this.movimientoTarjeta.venta.mesesFinanciamiento = 0;
          this.movimientoTarjeta.venta.mesesParcialidades = Number(this.mesesSeleccionados);
          this.movimientoTarjeta.saleRequest = this.saleRequest;
          this.movimientoTarjeta.cardData = this.cardMSIConfig.card;

          //console.log(` this.movimientoTarjeta = ${JSON.stringify( this.movimientoTarjeta)}`);
          //#endregion
        
          this._salesService.procesarMovimientoPagoTarjetaVisaMaster(this.movimientoTarjeta).subscribe(resp => {
            this.cargando = false;
            if (resp.codeNumber === 0) {
              this.cancelarMovimiento = true;
              const pago = new FormaPagoUtilizado();
              pago.estatus = EstadosPago.Registrado;
              pago.codigoFormaPagoImporte = TipoPago.tarjetaCreditoDebit;
              pago.importeMonedaNacional = recibido;
              pago.secuenciaFormaPagoImporte = this.movimientoTarjeta.venta.secuenciaFormaPagoImporte;
              pago.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
              pago.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };

              //debugger;
              
              this.totalAplicandoPromociones = Number(recibido);

              if (!this._pagosMaster.pagoAdded && (this.totalAplicandoPromociones == pago.importeMonedaNacional)) {

                pago.descuentosPromocionalesPorVentaAplicados = {
                  descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
                    descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
                    return descuentoAplicado;
                  })
                };

                pago.descuentosPromocionalesPorLineaAplicados = {
                  descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
                    descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
                    return descuentoAplicado;
                  })
                };
              }

              const pagoDisplay = new PagosToDisplay({
                nombre: PagosOps.tarjetaCreditoDebit,
                cantidad: pago.importeMonedaNacional,
                clave: TipoPago.tarjetaCreditoDebit,
                formaDePago: pago
              }

              );
              
              // if (resp.sePuedePagarConPuntos) {
              //   this.tarjetaCredito = true;
              //   this.mensajeTarjeta = '¿ Desea pagar con puntos Bancomer? ';
              //   this.pago = pagoDisplay;
              //   // this.closeModal();
              //   this.showMovimientoExtra = true;
              //   this.toDisabled = true;
              // } else if (resp.sePuedeRetirar) {
              //   this.tarjetaCredito = false;
              //   this.mensajeTarjeta = '¿ Desea realizar retiro de efectivo? ';
              //   // this.closeModal();
              //   this.pago = pagoDisplay;
              //   this.showMovimientoExtra = true;
              //   this.toDisabled = true;
              // } else {

              //   this._pagosMaster.addPago(pagoDisplay);

              //   this.closeModal();
              //   this.alertService.show({ titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription });
              // }

              this.tarjetaCredito = this.cardMSIConfig.card.producto == "c" ? true : false;
              this.pago = pagoDisplay;

              this._pagosMaster.addPago(pagoDisplay);

              this.alertService.show({ titulo: 'Milano', tipo: 'success', mensaje: 'Aprobada' });
              this.closeModal();

            } else {
              this.alertService.show({ titulo: 'Milano', tipo: 'error', mensaje: resp.codeDescription });
              this.toDisable = true;
            }



            

          }, (err: HttpErrorResponse) => {
            this.cargando = false;
            this.toDisable = true;
          });
        } else {
          this.alertService.show({
            mensaje: 'El monto máximo a pagar con tarjeta es ' + this.totalToPay,
            tipo: 'error',
            titulo: 'Milano'
          });
        }
      }
    }
  }

  movimientoExtraTarjeta() {
    this.toDisabled = false;
    if (this.tarjetaCredito) {
      this.movimientoTarjeta.puntos = new PuntosTarjetaRequest();
      this.movimientoTarjeta.puntos.pagarConPuntos = this.puntosBancomer = true;
      this.pagoPuntos();
    } else {
      this.movimientoTarjeta.retiro = new RetiroTarjetaRequest();
      this.cashBack = true;
      this.movimientoTarjeta.retiro.retirar = true;
    }
  }

  pagoPuntos() {
    switch (this.formasPagoMenu.origenPago) {
      case OrigenPago.normal:
        this.movimientoTarjeta.venta.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
        this.movimientoTarjeta.puntos.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
        this.movimientoTarjeta.venta.clasificacionVenta = ClasificacionVenta.regular;
        break;
      case OrigenPago.tarjetaCmm:
        this.movimientoTarjeta.venta.folioOperacionAsociada = '';
        this.movimientoTarjeta.puntos.folioOperacionAsociada = '';
        this.movimientoTarjeta.venta.clasificacionVenta = ClasificacionVenta.regular;
        break;
      case OrigenPago.apartado:
        this.movimientoTarjeta.venta.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
        this.movimientoTarjeta.puntos.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
        this.movimientoTarjeta.venta.clasificacionVenta = ClasificacionVenta.apartado;
        break;
    }
    this.movimientoTarjeta.puntos.codigoFormaPagoImporte = TipoPago.tarjetaCreditoDebit; // TipoPago.tarjetaVisa;
    this.movimientoTarjeta.puntos.importeVentaTotal = this.movimientoTarjeta.venta.importeVentaTotal;
    this.movimientoTarjeta.puntos.estatus = EstadosPago.Exitoso;
    this.movimientoTarjeta.puntos.secuenciaFormaPagoImporte = this.movimientoTarjeta.venta.secuenciaFormaPagoImporte;
    this.cargando = true;
    this._salesService.procesarMovimientoTarjetaBancariaConPuntos(this.movimientoTarjeta).subscribe(resp => {
      this.cargando = false;
      if (resp.codeNumber === 0) {

        this.pago.numeroTarjeta = resp.authorization;
        this._pagosMaster.addPago(this.pago);

        this.closeModal();
        this.alertService.show({ titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription });
      } else {
        this.alertService.show({ titulo: 'Milano', tipo: 'error', mensaje: resp.codeDescription });
        this.closeModal();
      }

    }, (err: HttpErrorResponse) => {
      this.cargando = false;
    });
  }

  declineMovimientoExtraTarjeta() {
    this.toDisabled = false;
    if (this.tarjetaCredito) {
      this.puntosBancomer = false;
      this.movimientoTarjeta.puntos = new PuntosTarjetaRequest();
      this.movimientoTarjeta.puntos.pagarConPuntos = this.puntosBancomer = false;
      this.pagoPuntos();
    } else {
      this.cashBack = false;
      this.movimientoTarjeta.retiro = new RetiroTarjetaRequest();
      this.closeModalCash();
    }
  }
  
cancelarMovimientoTarjeta() {

    this.toDisabled = false;
    this.cargando = true;
    this.cashBack = false;
  
  this._salesService.procesarMovimientoTarjetaBancariaCancelar(this.movimientoTarjeta).subscribe(resp => {
      this.cargando = false;
      if (resp.codeNumber === 102) {
        this.alertService.show({ tipo: 'success', titulo: 'Milano', mensaje: 'Se Canceló Movimiento Exitosamente' });
        this.closeModal();
      } else {
        this.alertService.show({ titulo: 'Milano', tipo: 'error', mensaje: resp.codeDescription });
        this.closeModal();
      }
    }, (err: HttpErrorResponse) => {
      this.cargando = false;
    });
  }

  closeModalCash() {
    if (this.importeCashBack !== this.Confirmacion) {
      this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Los montos capturados deben coincidir' });
      this.toDisable = true;
    } else {
      switch (this.formasPagoMenu.origenPago) {
        case OrigenPago.normal:
          this.movimientoTarjeta.venta.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
          this.movimientoTarjeta.retiro.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
          this.movimientoTarjeta.venta.clasificacionVenta = ClasificacionVenta.regular;
          break;
        case OrigenPago.tarjetaCmm:
          this.movimientoTarjeta.venta.folioOperacionAsociada = '';
          this.movimientoTarjeta.retiro.folioOperacionAsociada = '';
          this.movimientoTarjeta.venta.clasificacionVenta = ClasificacionVenta.regular;
          break;
        case OrigenPago.apartado:
          this.movimientoTarjeta.venta.folioOperacionAsociada =
            this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
          this.movimientoTarjeta.retiro.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
          this.movimientoTarjeta.venta.clasificacionVenta = ClasificacionVenta.apartado;
          break;
      }
      this.movimientoTarjeta.retiro.importeCashBack = this.importeCashBack;
      this.movimientoTarjeta.retiro.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
      this.movimientoTarjeta.retiro.codigoFormaPagoImporte = TipoPago.cashBack;
      this.movimientoTarjeta.retiro.estatus = EstadosPago.Exitoso;
      this.cargando = true;
      this._salesService.procesarMovimientoTarjetaBancariaCashBack(this.movimientoTarjeta).subscribe(resp => {
        this.cargando = false;
        if (resp.codeNumber === 0) {
          this.pago.numeroTarjeta = resp.authorization;
          this._pagosMaster.addPago(this.pago);

          this.alertService.show({ titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription });
          this.closeModal();
        } else {
          this.alertService.show({ titulo: 'Milano', tipo: 'error', mensaje: resp.codeDescription });
          this.closeModal();
        }

      }, (err: HttpErrorResponse) => {
        this.cargando = false;
      });
    }
  }

  getPromocionesPosibles(promociones: {
    promocionesPosiblesAplicablesLinea: Array<DescuentoPromocionalLineaModel>,
    promocionesPosiblesAplicablesVenta: Array<DescuentoPromocionalVentaModel>,
    descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>,
    descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>,
    totalAplicandoPromociones: Number
  }) {

    this.promocionesPosiblesLinea = promociones.promocionesPosiblesAplicablesLinea;
    this.promocionesPosiblesVenta = promociones.promocionesPosiblesAplicablesVenta;
    this.descuentosPromocionalesAplicadosLinea = promociones.descuentosPromocionalesAplicadosLinea;
    this.descuentosPromocionalesAplicadosVenta = promociones.descuentosPromocionalesAplicadosVenta;
    this.totalAplicandoPromociones = promociones.totalAplicandoPromociones;

    if (!this._pagosMaster.PagosMaster.totales.totalAbono && this.formasPagoMenu.origenPago !== OrigenPago.apartado) {
      this.recibido = this.totalAplicandoPromociones;
    }

  }

}

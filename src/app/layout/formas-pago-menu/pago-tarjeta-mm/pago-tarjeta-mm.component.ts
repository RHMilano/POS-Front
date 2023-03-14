import { Component, Input, OnInit } from '@angular/core';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { AlertService } from '../../../services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SalesService } from '../../../services/sales.service';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';
import { MovimientoTarjetaRequest } from '../../../Models/Pagos/MovimientoTarjeta';
import {
  ClasificacionVenta,
  EstadosPago,
  OrigenPago,
  PagosOps,
  TipoPago,
  TipoPagoAccesoBoton
} from '../../../shared/GLOBAL';
import { PagosMasterService } from '../../../services/pagos-master.service';
import { VentaTarjetaRequest } from '../../../Models/Pagos/VentaTarjetaRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { PlanesFinanciamientoRequest } from '../../../Models/Sales/PlanesFinanciamientoRequest';
import { PlanFinanciamientoResponse } from '../../../Models/Sales/PlanFinanciamientoResponse';
import { FinalizarPagoTCMM } from '../../../Models/Pagos/FinalizarPagoTCMM';
import { RetiroTarjetaRequest } from '../../../Models/Pagos/RetiroTarjetaRequest';
import { PuntosTarjetaRequest } from '../../../Models/Pagos/PuntosTarjetaRequest';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import { DescuentoPromocionalLineaModel } from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import { DescuentoPromocionalVentaModel } from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import { Decimal } from 'decimal.js';
import { DescuentoPromocionalAplicado } from '../../../Models/Sales/DescuentoPromocionalAplicado';
import { DosDecimalesPipe } from '../../../pipes/dos-decimales.pipe';
//import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-pago-tarjeta-mm',
  templateUrl: './pago-tarjeta-mm.component.html',
  styleUrls: ['./pago-tarjeta-mm.component.css'],
  providers: [SalesService, DosDecimalesPipe]
})
export class PagoTarjetaMmComponent implements OnInit {
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  tipoPago = TipoPagoAccesoBoton.tarjetaMM;
  recibido: number;
  importeNuevo: number;
  totalToPay = 0;
  tarjetaNumero: string;
  folioVenta: string;
  toDisable: boolean;
  movimientoTarjeta: FinalizarPagoTCMM;
  cargando: boolean;
  planes: Array<PlanFinanciamientoResponse>;
  selectPlan;
  mensajeTarjeta: string;
  totalOriginal = 0;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  promocionesPosiblesVentaMM: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;

  constructor(private modalService: BsModalService, private alertService: AlertService, private _salesService: SalesService,
    public _pagosMaster: PagosMasterService, private dosDecimales: DosDecimalesPipe) {
  }

  ngOnInit() {
    this.totalOriginal = this._pagosMaster.PagosMaster.totales.totalSaleLast;
    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast);
    this.recibido = this.dosDecimales.calc(this.totalToPay);
    this.toDisable = true;
    this.movimientoTarjeta = new FinalizarPagoTCMM();
    this.planes = [];
    this.mensajeTarjeta = 'Obtener Tarjeta';
  }

  changeMjs() {
    if (!this.tarjetaNumero) {
      this.mensajeTarjeta = 'Obtener Tarjeta';
    } else if (this.tarjetaNumero.length == 16) {
      this.mensajeTarjeta = 'Siguiente >>';
    }
  }

  cancelPay() {
    this.closeModal();
  }

  closeModal() {
    this.formasPagoMenu.closeModal();
  }

  validatePay() {
    if (!this.recibido || Number(this.recibido) === 0 || Number(this.recibido) <= 0 || (this.planes.length && !this.selectPlan)) {
      return false;
    } else {
      return true;
    }
  }

  resetVar() {
    this.selectPlan = undefined;
    this.planes = [];
  }

  addPay() {

    if (this.importeNuevo < this.recibido) {
      this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'La cantidad a pagar debe ser igual al total con descuento.' });
      return;
    }

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
        this.movimientoTarjeta.numeroTarjeta = this.tarjetaNumero;
        this.movimientoTarjeta.planFinanciamiento = this.selectPlan;
        this.movimientoTarjeta.codigoFormaPagoImporte = TipoPago.tarjetaMM;

        //OCG: Selección del plan de financiamiento y asignación
        //console.log(`...this.selectPlan: ${this.selectPlan}`);
        //console.log(`...this.planes: ${ JSON.stringify(this.planes)}`);
        //console.log(`...this.movimientoTarjeta.planFinanciamiento: ${ this.movimientoTarjeta.planFinanciamiento}`);
        const resultado = this.planes.find(x => x.id === Number(this.selectPlan));
        //console.log(`...resultado: ${JSON.stringify(resultado)}`);

        switch (this.formasPagoMenu.origenPago) {
          case OrigenPago.normal:
            this.movimientoTarjeta.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
            this.movimientoTarjeta.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.tarjetaCmm:
            this.movimientoTarjeta.folioOperacionAsociada = '';
            this.movimientoTarjeta.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.apartado:
            this.movimientoTarjeta.folioOperacionAsociada =
              this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
            this.movimientoTarjeta.clasificacionVenta = ClasificacionVenta.apartado;
            break;
        }

        this.movimientoTarjeta.estatus = EstadosPago.Registrado;
        this.movimientoTarjeta.importeVentaTotal = recibido;
        this.movimientoTarjeta.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
        this.movimientoTarjeta.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
        this.movimientoTarjeta.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };

        // console.log(`this.recibido: ${this.recibido}`)
        // console.log(`this.movimientoTarjeta: ${this.movimientoTarjeta}`);
        // console.log(`this.recibido: ${this.recibido}`);
        // console.log(`this.totalToPay: ${this.totalToPay}`);

        if (Number(this.recibido) <= this.totalToPay) {

          // console.log(`this._pagosMaster.pagoAdded: ${this._pagosMaster.pagoAdded}`)
          // console.log(`this.totalAplicandoPromociones: ${this.totalAplicandoPromociones}`)
          // console.log(`this.totalAplicandoPromociones.comparedTo(recibido): ${this.totalAplicandoPromociones.comparedTo(recibido)}`)
          // console.log(`this.importeNuevo: ${this.importeNuevo}`)

          // if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones
          //   && this.totalAplicandoPromociones.comparedTo(recibido) <= 0 &&
          //   Number(this.recibido) >= this.importeNuevo)
          // OCG: Condición If modificada

          if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones
            && this.totalAplicandoPromociones.comparedTo(recibido) >= 0
            && Number(this.recibido) <= this.importeNuevo) {

            this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
            this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);

            // No entra en pago tcmm primera compra
            this.movimientoTarjeta.descuentosPromocionalesPorVentaAplicados = {
              descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
                descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.tarjetaMM;
                return descuentoAplicado;
              })
            };

            // No entra en pago tcmm primera compra
            this.movimientoTarjeta.descuentosPromocionalesPorLineaAplicados = {
              descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
                descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.tarjetaMM;
                return descuentoAplicado;
              })
            };

            /* Aqui se descuenta el monto promocianal por primera compra con TCMM
            siempre y cuando this.promocionesPosiblesVentaMM tenga información cargada
            previamente por GetPlanes(). Recordar que GetPlanes() obtiene los planes de financiamiento
            y los descuentos promocionales de primera compra*/
            if (this.promocionesPosiblesVentaMM) {
              //console.log(`this.promocionesPosiblesVentaMM: ${JSON.stringify(this.promocionesPosiblesVentaMM)}`);
              this.movimientoTarjeta.descuentosPromocionalesPorVentaAplicados = {
                descuentoPromocionesAplicados: this.promocionesPosiblesVentaMM.map(descuentoAplicado => {
                  descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.tarjetaMM;
                  return descuentoAplicado;
                })
              };
            }
          }

          this.cargando = true;

          if (Number(this.importeNuevo) <= Number(this.recibido)) {
            this.recibido = this.dosDecimales.calc(this.importeNuevo);
            this.movimientoTarjeta.importeVentaTotal = this.recibido;
          }


          /*IMPORTANT: OCG: Aqui se recupera el id del plazo a meses seleccionado y se busca en el arreglo
          de meses "planes" el id correspondiente a "selectPlan" para a su vez extraer el número de meses
          correspondientes al plazo. Y con este cambio se envía la información al BackEnd
          */
          const mesesFinanciados = this.planes.find(x => x.id === Number(this.selectPlan));
          this.movimientoTarjeta.mesesFinanciados = Number(mesesFinanciados.periodo);

          /*CALLEND.: Este servicio es el que agrega el pago al de la tarjeta de crédito al
          backend */
          this._salesService.procesarMovimientoPagoTarjetaMM(this.movimientoTarjeta).subscribe(resp => {
            this.cargando = false;

            //console.log(`resp de this._salesService.procesarMovimientoPagoTarjetaMM: ${JSON.stringify(resp)}`);

            if (resp.codigoRespuestaTCMM.codigoRespuesta === '0') {

              const pago = new FormaPagoUtilizado();
              pago.estatus = EstadosPago.Registrado;
              pago.codigoFormaPagoImporte = TipoPago.tarjetaMM;
              pago.importeMonedaNacional = this.recibido;
              pago.secuenciaFormaPagoImporte = this.movimientoTarjeta.secuenciaFormaPagoImporte;
              pago.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
              pago.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };

              // OCG:
              // console.log(`INFORMACIÓN DE const pago:\n
              // pago.estatus: ${pago.estatus} \n
              // pago.codigoFormaPagoImporte: ${pago.codigoFormaPagoImporte} \n
              // pago.importeMonedaNacional: ${pago.importeMonedaNacional} \n
              // pago.secuenciaFormaPagoImporte: ${pago.secuenciaFormaPagoImporte} \n
              // pago.descuentosPromocionalesPorVentaAplicados: ${pago.descuentosPromocionalesPorVentaAplicados} \n
              // pago.descuentosPromocionalesPorLineaAplicados: ${pago.descuentosPromocionalesPorLineaAplicados} \n`);

              // console.log('EVALUAR PARAMETROS DEL PAGO MASTER IF');

              // console.log(`this._pagosMaster.pagoAdded: ${this._pagosMaster.pagoAdded}`);
              // console.log(`this.totalAplicandoPromociones: ${this.totalAplicandoPromociones}`);
              // console.log(`this.this.totalAplicandoPromociones.comparedTo(this.recibido): ${this.totalAplicandoPromociones.comparedTo(this.recibido)}`);
              // console.log(`this.recibido: ${this.recibido}`);
              // console.log(`this.importeNuevo: ${this.importeNuevo}`);

              // if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones
              //   && this.totalAplicandoPromociones.comparedTo(this.recibido) <= 0 &&
              //   Number(this.recibido) >= this.importeNuevo) {

              if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones
                && this.totalAplicandoPromociones.comparedTo(this.recibido) >= 0
                && Number(this.recibido) <= this.importeNuevo) {

                this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVentaMM(this.promocionesPosiblesVentaMM);

                pago.descuentosPromocionalesPorVentaAplicados = {
                  descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
                    descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.tarjetaMM;
                    //console.log(descuentoAplicado);
                    return descuentoAplicado;
                  })
                };

                pago.descuentosPromocionalesPorLineaAplicados = {
                  descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
                    descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.tarjetaMM;
                    return descuentoAplicado;
                  })
                };

                //Entra en pago normal aqui que se deetenga f11
                if (this.promocionesPosiblesVentaMM) {
                  pago.descuentosPromocionalesPorVentaAplicados = {
                    descuentoPromocionesAplicados: this.promocionesPosiblesVentaMM.map(descuentoAplicado => {
                      descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.tarjetaMM;
                      //console.log(descuentoAplicado);
                      return descuentoAplicado;
                    })
                  };
                }
              }

              //console.log( pago.descuentosPromocionalesPorVentaAplicados);

              const pagoDisplay = new PagosToDisplay({
                nombre: PagosOps.tarjetaMM,
                cantidad: pago.importeMonedaNacional,
                clave: TipoPago.tarjetaMM,
                numeroTarjeta: String(this.tarjetaNumero),
                formaDePago: pago
              }

              );

              //console.log(`pagoDisplay: ${pagoDisplay}` );

              this._pagosMaster.addPago(pagoDisplay);

              this.closeModal();
              this.alertService.show({ titulo: 'Milano', tipo: 'success', mensaje: 'Pago autorizado ' + resp.authorization });
            } else {
              this.recibido = this.totalOriginal;
              this.alertService.show({ titulo: 'Error', tipo: 'error', mensaje: resp.codigoRespuestaTCMM.mensajeRetorno });
              this.toDisable = true;
              this.resetVar();
              this.closeModal();
            }

          }, (err: HttpErrorResponse) => {
            this.cargando = false;
            this.toDisable = true;
          });
        } else {
          this.alertService.show({
            mensaje: 'El monto máximo a pagar con tarjeta es ' + this.totalToPay,
            tipo: 'error',
            titulo: 'milano'
          });
          this.toDisable = true;
        }
      }
    }
  }
  //DESCRIPTION: Obtiene los planes de financiamiento de la TCMM capturada
  getPlanes() {
    if (this.tarjetaNumero.length !== 16) {
      this.alertService.show({ titulo: 'Error', tipo: 'error', mensaje: 'El número de la tarjeta debe ser de 16 digitos' });
      return;
    }

    /*IMPORTANT: No me queda claro cuando el valor de !this.tarjetaNumero va ser true o por que se
    tendría que ejecutar el código si no han capturado un número de tarjeta */
    if (!this.tarjetaNumero) {

      this.cargando = true;
      const numeroTarjeta = new MovimientoTarjetaRequest();
      numeroTarjeta.retiro = new RetiroTarjetaRequest();
      numeroTarjeta.puntos = new PuntosTarjetaRequest();
      numeroTarjeta.venta = new VentaTarjetaRequest();
      numeroTarjeta.venta.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;

      this.toDisable = false;
      /*CALLEND.: 2 */
      this._salesService.obtenerTarjetaMM(numeroTarjeta).subscribe(resp => {
        //console.log(` 2 resp: ${JSON.stringify(resp)}`);
        if (resp.codeNumber === 0) {
          this.toDisable = true;
          this.cargando = false;
          this.tarjetaNumero = resp.cardNumber;
          this.getPlanes();
        } else {
          this.alertService.show({ titulo: 'Error', tipo: 'error', mensaje: resp.codeDescription });
          this.cargando = true;
          this.toDisable = true;
          this.closeModal();
        }
      }, (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toDisable = true;
      });
    } else {

      const planesRequest = new PlanesFinanciamientoRequest();
      planesRequest.numeroTarjeta = this.tarjetaNumero;
      this.toDisable = false;

      if (this.formasPagoMenu.origenPago === OrigenPago.apartado) {
        planesRequest.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
      } else {
        planesRequest.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
      }

      /*CALLEND.: 1.- Obtener los planes de financiamiento aplicables a la tarjeta TCMM junto
      con las promociones de primera compra si es que aplica.*/
      this._salesService.planesFinanciamientoService(planesRequest).subscribe(resp => {
        if (resp.planesFinanciamiento && resp.planesFinanciamiento.length) {
          this.toDisable = true;
          resp.planesFinanciamiento.forEach(item => {
            /*IMPORTANT: planes: se utiliza para llenar el select option y se queda utilizable
             para cuando se requiera recuparar el número de meses por medio de la
             propiedad value del select*/
            this.planes.push(item);
          });
          if (resp.descuentoPromocionalPrimeraCompra && this.totalOriginal === this.totalToPay) {

            this.promocionesPosiblesVentaMM.push(resp.descuentoPromocionalPrimeraCompra);
            this.importeNuevo = new Decimal(this.recibido).minus(resp.descuentoPromocionalPrimeraCompra.importeDescuento).toNumber();
            //OCG: Igualar el monto a pagar con el descuento

            //alert(this.recibido);
            this.totalAplicandoPromociones = new Decimal(this.recibido).minus(resp.descuentoPromocionalPrimeraCompra.importeDescuento);
            this.recibido = this.importeNuevo;

            //alert(this.totalAplicandoPromociones);
          }
        } else {
          this.toDisable = true;
          this.alertService.show({ titulo: 'Error', tipo: 'error', mensaje: resp.codigoRespuestaTCMM.mensajeRetorno });
          this.closeModal();
        }
      }, (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toDisable = true;
      });
    }
  }

  getPromocionesPosibles(promociones: {
    promocionesPosiblesAplicablesLinea: Array<DescuentoPromocionalLineaModel>,
    promocionesPosiblesAplicablesVenta: Array<DescuentoPromocionalVentaModel>,
    promocionesPosiblesAplicablesVentaMM: Array<DescuentoPromocionalVentaModel>,
    descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>,
    descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>,
    totalAplicandoPromociones: Decimal
  }) {
    this.promocionesPosiblesLinea = promociones.promocionesPosiblesAplicablesLinea;
    this.promocionesPosiblesVenta = promociones.promocionesPosiblesAplicablesVenta;
    this.promocionesPosiblesVentaMM = promociones.promocionesPosiblesAplicablesVentaMM;
    this.descuentosPromocionalesAplicadosLinea = promociones.descuentosPromocionalesAplicadosLinea;
    this.descuentosPromocionalesAplicadosVenta = promociones.descuentosPromocionalesAplicadosVenta;
    this.totalAplicandoPromociones = promociones.totalAplicandoPromociones;

    if (!this._pagosMaster.PagosMaster.totales.totalAbono && this.formasPagoMenu.origenPago !== OrigenPago.apartado) {
      this.recibido = this.totalAplicandoPromociones.toNumber();
    }

  }
}


import {Component, Input, OnInit} from '@angular/core';
import {FormasPagoMenuComponentInterface} from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import {DescuentoPromocionalLineaModel} from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import {DescuentoPromocionalVentaModel} from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import {DescuentoPromocionalAplicado} from '../../../Models/Sales/DescuentoPromocionalAplicado';
import {Decimal} from 'decimal.js';
import {ClasificacionVenta, EstadosPago, OrigenPago, PagosOps, TipoPago, TipoPagoAccesoBoton} from '../../../shared/GLOBAL';
import {PagosMasterService} from '../../../services/pagos-master.service';
import {FormaPagoUtilizado} from '../../../Models/Pagos/FormaPagoUtilizado';
import {PagosToDisplay} from '../../../Models/Pagos/PagosToDisplay';
import {AlertService} from '../../../services/alert.service';
import {SalesService} from '../../../services/sales.service';
import {MovimientoNotaCreditoRequest} from '../../../Models/Pagos/MovimientoNotaCreditoRequest';

@Component({
  selector: 'app-notas-de-credito',
  templateUrl: './notas-de-credito.component.html',
  styleUrls: ['./notas-de-credito.component.css'],
  providers: [ SalesService ]
})
export class NotasDeCreditoComponent implements OnInit {

  notaNumero;
  recibido: number;
  totalToPay = 0;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;
  tipoPago = TipoPagoAccesoBoton.notaCredito;
  toDisable: boolean;
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;

  constructor(private _pagosMaster: PagosMasterService,  private alertService: AlertService, private _salesService: SalesService) { }

  ngOnInit() {
    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast);
    this.toDisable = true;
  }

  cancelPay() {
    this.closeModal();
  }

  closeModal() {
    this.formasPagoMenu.closeModal();
  }

  addPay() {
    this.toDisable = false;
    if (!this.recibido) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto'});
      this.toDisable = true;
      return;
    } else {
      if (Number(this.recibido) === 0 || Number(this.recibido) <= 0) {
        this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto válido'});
        this.toDisable = true;
        return;
      } else {
        const movimientoNotaCreditoRequest = new MovimientoNotaCreditoRequest();
        const recibido = Number(this.recibido);
        movimientoNotaCreditoRequest.codigoFormaPagoImporte = TipoPago.notaCredito;
        movimientoNotaCreditoRequest.estatus = EstadosPago.Registrado;
        switch (this.formasPagoMenu.origenPago) {
          case OrigenPago.normal:
            movimientoNotaCreditoRequest.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
            movimientoNotaCreditoRequest.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.tarjetaCmm:
            movimientoNotaCreditoRequest.folioOperacionAsociada = '';
            movimientoNotaCreditoRequest.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.apartado:
            movimientoNotaCreditoRequest.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
            movimientoNotaCreditoRequest.clasificacionVenta = ClasificacionVenta.apartado;
            break;
        }
        movimientoNotaCreditoRequest.folioNotaCredito = this.notaNumero;
        movimientoNotaCreditoRequest.importeVentaTotal = recibido;
        movimientoNotaCreditoRequest.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
        movimientoNotaCreditoRequest.descuentosPromocionalesPorVentaAplicados = {descuentoPromocionesAplicados: []};
        movimientoNotaCreditoRequest.descuentosPromocionalesPorLineaAplicados = {descuentoPromocionesAplicados: []};

        if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones && this.totalAplicandoPromociones.comparedTo(recibido) <= 0) {

          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);

          movimientoNotaCreditoRequest.descuentosPromocionalesPorVentaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.notaCredito;
              return descuentoAplicado;
            })
          };

          movimientoNotaCreditoRequest.descuentosPromocionalesPorLineaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.notaCredito;
              return descuentoAplicado;
            })
          };
        }

        if (Number(this.recibido) <= this.totalToPay) {

          this._salesService.procesarMovimientoNotaCredito(movimientoNotaCreditoRequest).subscribe(resp => {
            if (Number(resp.codeNumber) === 353) {
              const pago = new FormaPagoUtilizado();
              pago.estatus = EstadosPago.Registrado;
              pago.codigoFormaPagoImporte = TipoPago.notaCredito;
              pago.importeMonedaNacional = recibido;
              pago.secuenciaFormaPagoImporte = movimientoNotaCreditoRequest.secuenciaFormaPagoImporte;
              pago.descuentosPromocionalesPorVentaAplicados = {descuentoPromocionesAplicados: []};
              pago.descuentosPromocionalesPorLineaAplicados = {descuentoPromocionesAplicados: []};

              if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones.comparedTo(pago.importeMonedaNacional) <= 0) {

                pago.descuentosPromocionalesPorVentaAplicados = {
                  descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
                    descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.notaCredito;
                    return descuentoAplicado;
                  })
                };

                pago.descuentosPromocionalesPorLineaAplicados = {
                  descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
                    descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.notaCredito;
                    return descuentoAplicado;
                  })
                };
              }


              const pagoDisplay = new PagosToDisplay({
                  nombre: PagosOps.notaCredito,
                  cantidad: pago.importeMonedaNacional,
                  clave: TipoPago.notaCredito,
                  numeroTarjeta: String(this.notaNumero),
                  formaDePago: pago
                }
              );

              this._pagosMaster.addPago(pagoDisplay);

              this.closeModal();
              this.alertService.show({titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription});
            } else {
              this.toDisable = true;
              this.alertService.show({titulo: 'Error', tipo: 'error', mensaje: resp.codeDescription});
            }

          });
        } else {
          this.alertService.show({
            mensaje: 'El monto máximo a pagar con tarjeta es ' + this.totalToPay,
            tipo: 'error',
            titulo: 'milano'
          });
        }
      }
    }
  }

  validatePay() {
    if (!this.recibido || Number(this.recibido) === 0 || Number(this.recibido) <= 0) {
      return false;
    } else {
      return true;
    }
  }

  getPromocionesPosibles(promociones: {
    promocionesPosiblesAplicablesLinea: Array<DescuentoPromocionalLineaModel>,
    promocionesPosiblesAplicablesVenta: Array<DescuentoPromocionalVentaModel>,
    descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>,
    descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>,
    totalAplicandoPromociones: Decimal
  }) {

    this.promocionesPosiblesLinea = promociones.promocionesPosiblesAplicablesLinea;
    this.promocionesPosiblesVenta = promociones.promocionesPosiblesAplicablesVenta;
    this.descuentosPromocionalesAplicadosLinea = promociones.descuentosPromocionalesAplicadosLinea;
    this.descuentosPromocionalesAplicadosVenta = promociones.descuentosPromocionalesAplicadosVenta;
    this.totalAplicandoPromociones = promociones.totalAplicandoPromociones;

  }
}

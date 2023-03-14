import { Component, Input, OnInit } from '@angular/core';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { AlertService } from '../../../services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ClasificacionVenta, EstadosPago, OrigenPago, PagosOps, TipoPago, TipoPagoAccesoBoton } from '../../../shared/GLOBAL';
import { SalesService } from '../../../services/sales.service';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';
import { PagosMasterService } from '../../../services/pagos-master.service';
import { MovimientoTarjetaRegaloRequest } from '../../../Models/Sales/MovimientoTarjetaRegaloRequest';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import { DescuentoPromocionalLineaModel } from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import { DescuentoPromocionalVentaModel } from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import { Decimal } from 'decimal.js';
import { DescuentoPromocionalAplicado } from '../../../Models/Sales/DescuentoPromocionalAplicado';

@Component({
  selector: 'app-pago-tarjeta-regalo',
  templateUrl: './pago-tarjeta-regalo.component.html',
  styleUrls: ['./pago-tarjeta-regalo.component.css'],
  providers: [SalesService]
})
export class PagoTarjetaRegaloComponent implements OnInit {
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  tipoPago = TipoPagoAccesoBoton.tarjetaRegalo;
  recibido: number;
  totalToPay = 0;
  tarjetaNumero: number;
  folioVenta: string;
  toDisable: boolean;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;

  constructor(private modalService: BsModalService, private alertService: AlertService, private _salesService: SalesService,
              private _pagosMaster: PagosMasterService) {
  }

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

  validatePay() {
    if (!this.recibido || Number(this.recibido) === 0 || Number(this.recibido) <= 0) {
      return false;
    } else {
      return true;
    }
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
        const movimientoTarjetaRegaloRequest = new MovimientoTarjetaRegaloRequest();
        const recibido = Number(this.recibido);
        movimientoTarjetaRegaloRequest.codigoFormaPagoImporte = TipoPago.tarjetaRegalo;
        movimientoTarjetaRegaloRequest.estatus = EstadosPago.Registrado;
        switch (this.formasPagoMenu.origenPago) {
          case OrigenPago.normal:
            movimientoTarjetaRegaloRequest.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
            movimientoTarjetaRegaloRequest.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.tarjetaCmm:
            movimientoTarjetaRegaloRequest.folioOperacionAsociada = '';
            movimientoTarjetaRegaloRequest.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.apartado:
            movimientoTarjetaRegaloRequest.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
            movimientoTarjetaRegaloRequest.clasificacionVenta = ClasificacionVenta.apartado;
            break;
        }
        movimientoTarjetaRegaloRequest.folioTarjeta = this.tarjetaNumero;
        movimientoTarjetaRegaloRequest.importeVentaTotal = recibido;
        movimientoTarjetaRegaloRequest.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
        movimientoTarjetaRegaloRequest.descuentosPromocionalesPorVentaAplicados = {descuentoPromocionesAplicados: []};
        movimientoTarjetaRegaloRequest.descuentosPromocionalesPorLineaAplicados = {descuentoPromocionesAplicados: []};

        if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones && this.totalAplicandoPromociones.comparedTo(recibido) <= 0) {

          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);

          movimientoTarjetaRegaloRequest.descuentosPromocionalesPorVentaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
              return descuentoAplicado;
            })
          };

          movimientoTarjetaRegaloRequest.descuentosPromocionalesPorLineaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
              return descuentoAplicado;
            })
          };
        }

        if (Number(this.recibido) <= this.totalToPay) {

          this._salesService.procesarMovimientoTarjetaRegalo(movimientoTarjetaRegaloRequest).subscribe(resp => {
            if (resp.codeNumber === 'A' || resp.codeNumber === 'C') {
              const pago = new FormaPagoUtilizado();
              pago.estatus = EstadosPago.Registrado;
              pago.codigoFormaPagoImporte = TipoPago.tarjetaRegalo;
              pago.importeMonedaNacional = recibido;
              pago.secuenciaFormaPagoImporte = movimientoTarjetaRegaloRequest.secuenciaFormaPagoImporte;
              pago.descuentosPromocionalesPorVentaAplicados = {descuentoPromocionesAplicados: []};
              pago.descuentosPromocionalesPorLineaAplicados = {descuentoPromocionesAplicados: []};

              if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones.comparedTo(pago.importeMonedaNacional) <= 0) {

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
                  nombre: PagosOps.tarjetaRegalo,
                  cantidad: pago.importeMonedaNacional,
                  clave: TipoPago.tarjetaRegalo,
                  numeroTarjeta: String(this.tarjetaNumero),
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

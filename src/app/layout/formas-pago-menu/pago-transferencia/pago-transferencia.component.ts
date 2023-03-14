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
import {ProcesarMovimientoPagoPinPadMovilRequest} from '../../../Models/Pagos/ProcesarMovimientoPagoPinPadMovilRequest';
import {DosDecimalesPipe} from '../../../pipes/dos-decimales.pipe';

@Component({
  selector: 'app-pago-transferencia',
  templateUrl: './pago-transferencia.component.html',
  styleUrls: ['./pago-transferencia.component.css'],
  providers: [ SalesService, DosDecimalesPipe ]
})

export class PagoTransferenciaComponent implements OnInit {

  folioAutorizacion;
  recibido: number;
  totalToPay = 0;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;
  tipoPago = TipoPagoAccesoBoton.transferencia;
  toDisable: boolean;

  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;

  constructor(private _pagosMaster: PagosMasterService,  private alertService: AlertService,
              private _salesService: SalesService, private dosDecimales: DosDecimalesPipe) { }

  ngOnInit() {
    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast);
    this.toDisable = true;
    this.recibido = this.dosDecimales.calc(this.totalToPay);
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

        const movimientoPagoRequest = new ProcesarMovimientoPagoPinPadMovilRequest();
        const recibido = Number(this.recibido);

        movimientoPagoRequest.codigoFormaPagoImporte = TipoPago.transferencia;
        movimientoPagoRequest.estatus = EstadosPago.Registrado;

        switch (this.formasPagoMenu.origenPago) {
          case OrigenPago.normal:
            movimientoPagoRequest.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
            //movimientoPagoRequest.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.tarjetaCmm:
            movimientoPagoRequest.folioOperacionAsociada = '';
           // movimientoPagoRequest.clasificacionVenta = ClasificacionVenta.regular;
            break;
          case OrigenPago.apartado:
            movimientoPagoRequest.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
            //movimientoPagoRequest.clasificacionVenta = ClasificacionVenta.apartado;
            break;
        }

        movimientoPagoRequest.folioAutorizacionPinPadMovil = this.folioAutorizacion;
        //movimientoPagoRequest.folioAutorizacionPinPadMovil = "";
        movimientoPagoRequest.importeVentaTotal = recibido;
        movimientoPagoRequest.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
        movimientoPagoRequest.descuentosPromocionalesPorVentaAplicados = {descuentoPromocionesAplicados: []};
        movimientoPagoRequest.descuentosPromocionalesPorLineaAplicados = {descuentoPromocionesAplicados: []};

        if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones && this.totalAplicandoPromociones.comparedTo(recibido) <= 0) {

          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);

          movimientoPagoRequest.descuentosPromocionalesPorVentaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.transferencia;
              return descuentoAplicado;
            })
          };

          movimientoPagoRequest.descuentosPromocionalesPorLineaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.transferencia;
              return descuentoAplicado;
            })
          };
        }

        if (Number(this.recibido) <= this.totalToPay) {

          //? OCG aqui se debe de cambiar el nombre del endpoint
          this._salesService.procesarMovimientoPagoPinPadMovil(movimientoPagoRequest).subscribe(resp => {
            if (Number(resp.codeNumber) === 352) {
              const pago = new FormaPagoUtilizado();
              pago.estatus = EstadosPago.Registrado;
              pago.codigoFormaPagoImporte = TipoPago.transferencia;
              pago.importeMonedaNacional = recibido;
              pago.secuenciaFormaPagoImporte = movimientoPagoRequest.secuenciaFormaPagoImporte;
              pago.descuentosPromocionalesPorVentaAplicados = {descuentoPromocionesAplicados: []};
              pago.descuentosPromocionalesPorLineaAplicados = {descuentoPromocionesAplicados: []};

              if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones.comparedTo(pago.importeMonedaNacional) <= 0) {

                pago.descuentosPromocionalesPorVentaAplicados = {
                  descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
                    descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.transferencia;
                    return descuentoAplicado;
                  })
                };

                pago.descuentosPromocionalesPorLineaAplicados = {
                  descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
                    descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.transferencia;
                    return descuentoAplicado;
                  })
                };
              }

              const pagoDisplay = new PagosToDisplay({
                  nombre: PagosOps.transferencia,
                  cantidad: pago.importeMonedaNacional,
                  clave: TipoPago.transferencia,
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

    //if (!this.recibido || Number(this.recibido) === 0 || Number(this.recibido) <= 0 || !this.folioAutorizacion) {
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

    if (!this._pagosMaster.PagosMaster.totales.totalAbono && this.formasPagoMenu.origenPago !== OrigenPago.apartado) {
      this.recibido = this.totalAplicandoPromociones.toNumber();
    }
  }

}

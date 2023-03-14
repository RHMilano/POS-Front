import { Component, Input, OnInit } from '@angular/core';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { AlertService } from '../../../services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';
import { MovimientoTarjetaRequest } from '../../../Models/Pagos/MovimientoTarjeta';
import { SalesService } from '../../../services/sales.service';
import { PagosMasterService } from '../../../services/pagos-master.service';
import {ClasificacionVenta, EstadosPago, OrigenPago, PagosOps, TipoPago, TipoPagoAccesoBoton} from '../../../shared/GLOBAL';
import { VentaTarjetaRequest } from '../../../Models/Pagos/VentaTarjetaRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import {DescuentoPromocionalLineaModel} from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import {DescuentoPromocionalVentaModel} from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import {Decimal} from 'decimal.js';
import {DescuentoPromocionalAplicado} from '../../../Models/Sales/DescuentoPromocionalAplicado';
import {DosDecimalesPipe} from '../../../pipes/dos-decimales.pipe';

@Component({
  selector: 'app-pago-tarjeta-american-express',
  templateUrl: './pago-tarjeta-american-express.component.html',
  styleUrls: ['./pago-tarjeta-american-express.component.css'],
  providers: [SalesService, DosDecimalesPipe]
})
export class PagoTarjetaAmericanExpressComponent implements OnInit {
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  tipoPago = TipoPagoAccesoBoton.americanExpress;
  recibido: number;
  totalToPay = 0;
  tarjetaNumero: number;
  folioVenta: string;
  toDisable: boolean;
  movimientoTarjeta: MovimientoTarjetaRequest;
  cargando: boolean;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;

  constructor(private modalService: BsModalService, private alertService: AlertService, private _salesService: SalesService,
              public _pagosMaster: PagosMasterService, private dosDecimales: DosDecimalesPipe) {
  }

  ngOnInit() {
    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast);
    this.recibido = this.dosDecimales.calc(this.totalToPay);
    this.toDisable = true;
    this.movimientoTarjeta = new MovimientoTarjetaRequest();
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
      } else {
        const recibido = Number(this.recibido);
        this.movimientoTarjeta.venta = new VentaTarjetaRequest();
        this.movimientoTarjeta.venta.codigoFormaPagoImporte = TipoPago.americanExpress;
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

        if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones &&  this.totalAplicandoPromociones.comparedTo(recibido) <= 0) {

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
          this._salesService.procesarMovimientoTarjetaBancariaAmericanExpress(this.movimientoTarjeta).subscribe(resp => {
            this.cargando = false;
            if (resp.codeNumber === 0) {
              const pago = new FormaPagoUtilizado();
              pago.estatus = EstadosPago.Registrado;
              pago.codigoFormaPagoImporte = TipoPago.americanExpress;
              pago.importeMonedaNacional = this.recibido;
              pago.secuenciaFormaPagoImporte = this.movimientoTarjeta.venta.secuenciaFormaPagoImporte;
              pago.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
              pago.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };

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
                  nombre: PagosOps.americanExpress,
                  cantidad: pago.importeMonedaNacional,
                  clave: TipoPago.americanExpress,
                  numeroTarjeta: resp.authorization,
                  formaDePago: pago
                }
              );

              this._pagosMaster.addPago(pagoDisplay);

              this.closeModal();
              this.alertService.show({titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription});
            } else {
              this.alertService.show({titulo: 'Error', tipo: 'error', mensaje: resp.codeDescription});
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
            titulo: 'milano'
          });
          this.toDisable = true;
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

    if (!this._pagosMaster.PagosMaster.totales.totalAbono && this.formasPagoMenu.origenPago !== OrigenPago.apartado) {
      this.recibido = this.totalAplicandoPromociones.toNumber();
    }

  }
}

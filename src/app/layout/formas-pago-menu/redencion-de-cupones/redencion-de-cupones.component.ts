import { Component, Input, OnInit } from '@angular/core';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import { DescuentoPromocionalLineaModel } from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import { DescuentoPromocionalVentaModel } from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import { DescuentoPromocionalAplicado } from '../../../Models/Sales/DescuentoPromocionalAplicado';
import { Decimal } from 'decimal.js';
import { PagosMasterService } from '../../../services/pagos-master.service';
import { AlertService } from '../../../services/alert.service';
import { SalesService } from '../../../services/sales.service';
import { EstadosPago, OrigenPago, PagosOps, TipoPago, TipoPagoAccesoBoton } from '../../../shared/GLOBAL';
import { RedencionCuponesRequest } from '../../../Models/Pagos/RedencionCuponesRequest';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';

@Component({
  selector: 'app-redencion-de-cupones',
  templateUrl: './redencion-de-cupones.component.html',
  styleUrls: ['./redencion-de-cupones.component.css'],
  providers: [SalesService]
})
export class RedencionDeCuponesComponent implements OnInit {

  folio;
  totalToPay = 0;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;
  tipoPago = TipoPagoAccesoBoton.cupones;
  toDisable: boolean;
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;

  constructor(private _pagosMaster: PagosMasterService, private alertService: AlertService, private _salesService: SalesService) { }

  ngOnInit() {
    this.toDisable = true;
    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalTicketLast);
  }

  cancelPay() {
    this.closeModal();
  }

  closeModal() {
    this.formasPagoMenu.closeModal();
  }

  addPay() {
    if (this.folio) {
      this.toDisable = false;
      const cupon = new RedencionCuponesRequest();
      cupon.codigoFormaPagoImporte = TipoPago.cupones;
      cupon.estatus = EstadosPago.Registrado;
      cupon.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
      cupon.folioCuponPromocional = this.folio;
      cupon.importeVentaTotal = this.totalToPay;
      switch (this.formasPagoMenu.origenPago) {
        case OrigenPago.normal:
          cupon.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
          break;
        case OrigenPago.tarjetaCmm:
          cupon.folioOperacionAsociada = '';
          break;
        case OrigenPago.apartado:
          cupon.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
          break;
      }

      cupon.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
      cupon.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };

      this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
      this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);


      // cupon.descuentosPromocionalesPorVentaAplicados = {
      //   descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
      //     descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.notaCredito;
      //     return descuentoAplicado;
      //   })
      // };

      // cupon.descuentosPromocionalesPorLineaAplicados = {
      //   descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
      //     descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.notaCredito;
      //     return descuentoAplicado;
      //   })
      // };



      if (this.descuentosPromocionalesAplicadosVenta) {
        cupon.descuentosPromocionalesPorVentaAplicados = {
          descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
            descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.notaCredito;
            return descuentoAplicado;
          })
        };
      } else {
        cupon.descuentosPromocionalesPorVentaAplicados = {
          descuentoPromocionesAplicados: []
        }
      }

      if (this.descuentosPromocionalesAplicadosLinea) {
        cupon.descuentosPromocionalesPorLineaAplicados = {
          descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
            descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.notaCredito;
            return descuentoAplicado;
          })
        };
      } else {
        cupon.descuentosPromocionalesPorLineaAplicados = {
          descuentoPromocionesAplicados: []
        }
      }






      this._salesService.redencionCuponesService(cupon).subscribe(resp => {
        if (Number(resp.codeNumber) === 353) {
          this.toDisable = true;
          const pago = new FormaPagoUtilizado();
          pago.estatus = EstadosPago.Registrado;
          pago.codigoFormaPagoImporte = TipoPago.cupones;
          pago.importeMonedaNacional = Number(resp.saldoAplicado);
          pago.secuenciaFormaPagoImporte = cupon.secuenciaFormaPagoImporte;
          pago.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
          pago.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };

          if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones.comparedTo(pago.importeMonedaNacional) <= 0) {

            pago.descuentosPromocionalesPorVentaAplicados = {
              descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
                descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.cupones;
                return descuentoAplicado;
              })
            };

            pago.descuentosPromocionalesPorLineaAplicados = {
              descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
                descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.cupones;
                return descuentoAplicado;
              })
            };
          }


          const pagoDisplay = new PagosToDisplay({
            nombre: PagosOps.cupones,
            cantidad: pago.importeMonedaNacional,
            clave: TipoPago.cupones,
            numeroTarjeta: String(this.folio),
            formaDePago: pago
          }
          );

          this._pagosMaster.addPago(pagoDisplay);

          this.closeModal();
          this.alertService.show({ titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription });
        } else {
          this.toDisable = true;
          this.alertService.show({ titulo: 'Error', tipo: 'error', mensaje: resp.codeDescription });
        }

      });
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

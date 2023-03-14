import { Component, Input, OnInit } from '@angular/core';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { AlertService } from '../../../services/alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {EstadosPago, FlujoBloqueo, PagosOps, TipoPago, TipoPagoAccesoBoton} from '../../../shared/GLOBAL';
import { ProcesarMovimientoPagoVentaEmpleadoRequest } from '../../../Models/Sales/ProcesarMovimientoPagoVentaEmpleado';
import { SalesService } from '../../../services/sales.service';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';
import { PagosMasterService } from '../../../services/pagos-master.service';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import {DescuentoPromocionalLineaModel} from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import {DescuentoPromocionalVentaModel} from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import {Decimal} from 'decimal.js';
import {DescuentoPromocionalAplicado} from '../../../Models/Sales/DescuentoPromocionalAplicado';
import {DosDecimalesPipe} from '../../../pipes/dos-decimales.pipe';

@Component({
  selector: 'app-pago-financiamiento-empleado',
  templateUrl: './pago-financiamiento-empleado.component.html',
  styleUrls: ['./pago-financiamiento-empleado.component.css'],
  providers: [SalesService, DosDecimalesPipe]
})
export class PagoFinanciamientoEmpleadoComponent implements OnInit {
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  tipoPago = TipoPagoAccesoBoton.financiamento;
  recibido: number;
  montoCreditoFinanciamiento = 0;
  totalToPay = 0;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;


  constructor(private modalService: BsModalService, private alertService: AlertService, private _salesService: SalesService
    , private _pagosMaster: PagosMasterService, private _bsModalRef: BsModalRef, private dosDecimales: DosDecimalesPipe) {
  }

  ngOnInit() {
    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast);
    this.montoCreditoFinanciamiento = Number(this.formasPagoMenu.currentEmployee.montoCredito);
    this.recibido = this.dosDecimales.calc(this.totalToPay);
  }

  validatePay() {
    let estado = false;
    const recibido = Number(this.recibido);

    if (recibido > this.totalToPay || recibido === 0 || recibido === null || recibido > this.montoCreditoFinanciamiento) {
      estado = true;
    }

    return estado;
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  addPay() {
    if (!this.recibido) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto'});
      return;
    } else {
      if (Number(this.recibido) === 0 || Number(this.recibido) <= 0) {
        this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Ingrese una cantidad mayor a 0'});
        return;
      } else {
        const recibido = Number(this.recibido);
        const empRequest = new ProcesarMovimientoPagoVentaEmpleadoRequest();
        empRequest.codigoEmpleado = this.formasPagoMenu.currentEmployee.codigo;
        empRequest.codigoFormaPagoImporte = TipoPago.financiamento;
        empRequest.estatus = EstadosPago.Registrado;
        empRequest.montoFinanciado = recibido;
        empRequest.importeVentaTotal = this.formasPagoMenu.currentTotalizarInfo.pagoInfo.total;
        empRequest.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
        empRequest.importePagoMonedaNacional = recibido;
        empRequest.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
        empRequest.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
        empRequest.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };


        if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones &&  this.totalAplicandoPromociones.comparedTo(empRequest.importePagoMonedaNacional) <= 0) {

          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);

          empRequest.descuentosPromocionalesPorVentaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
              return descuentoAplicado;
            })
          };

          empRequest.descuentosPromocionalesPorLineaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
              return descuentoAplicado;
            })
          };
        }

        if (Number(this.recibido) <= this.totalToPay) {

          this._salesService.procesarMovimientoPagoVentaEmpleado(empRequest).subscribe(resp => {
            if (Number(resp.codeNumber) === 1) {
              const pago = new FormaPagoUtilizado();
              pago.importeMonedaNacional = recibido;
              pago.estatus = EstadosPago.Registrado;
              pago.codigoFormaPagoImporte = TipoPago.financiamento;
              pago.secuenciaFormaPagoImporte = empRequest.secuenciaFormaPagoImporte;
              pago.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
              pago.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };

              if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones.comparedTo(empRequest.importePagoMonedaNacional) <= 0) {

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
                nombre: PagosOps.financiamento,
                cantidad: pago.importeMonedaNacional,
                clave: TipoPago.financiamento,
                formaDePago: pago
              });

              this._pagosMaster.addPago(pagoDisplay);
              this.formasPagoMenu.pagoFinanciamientoAgregado = true;
              this.formasPagoMenu.bloqueaBtn(FlujoBloqueo.financiamientoAgregado);
              this.closeModal();
            } else {
              this.alertService.show({mensaje: resp.codeDescription, tipo: 'error', titulo: 'milano'});
            }
          });
        } else {
          this.alertService.show({
            mensaje: 'El monto máximo a pagar con financiamiento empleado es ' + this.totalToPay,
            tipo: 'error',
            titulo: 'Milano'
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

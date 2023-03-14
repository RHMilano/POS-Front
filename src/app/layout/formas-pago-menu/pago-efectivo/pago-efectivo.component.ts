import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../../../services/alert.service';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';
import { FlujoBloqueo, PagosOps, TipoPago, TipoPagoAccesoBoton } from '../../../shared/GLOBAL';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { PagosMasterService } from '../../../services/pagos-master.service';
import { BsModalRef } from 'ngx-bootstrap';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import { DescuentoPromocionalLineaModel } from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import { DescuentoPromocionalVentaModel } from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import { Decimal } from 'decimal.js';
import { DescuentoPromocionalAplicado } from '../../../Models/Sales/DescuentoPromocionalAplicado';

@Component({
  selector: 'app-pago-efectivo',
  templateUrl: './pago-efectivo.component.html',
  styleUrls: ['./pago-efectivo.component.css']
})
export class PagoEfectivoComponent implements OnInit {
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  tipoPago = TipoPagoAccesoBoton.efectivo;
  recibido: number;
  toDisable: boolean;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;

  constructor(private modalService: BsModalService, private alertService: AlertService
    , private _pagosMaster: PagosMasterService, public _bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.toDisable = true;
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  validatePay() {
    if (!this.recibido || Number(this.recibido) === 0 || Number(this.recibido) <= 0 || isNaN(Number(this.recibido))) {
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
      if (!this.validatePay()) {
        this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto válido'});
        this.toDisable = true;
        return;
      } else {


        const pago = new FormaPagoUtilizado();
        pago.importeMonedaNacional = Number(this.recibido);

        if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones && this.totalAplicandoPromociones.comparedTo(pago.importeMonedaNacional) <= 0
          && (this.promocionesPosiblesVenta.length || this.promocionesPosiblesLinea.length)) {

          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);

          pago.descuentosPromocionalesPorVentaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.efectivo;
              return descuentoAplicado;
            })
          };

          pago.descuentosPromocionalesPorLineaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.efectivo;
              return descuentoAplicado;
            })
          };
        }


        const pagoDisplay = new PagosToDisplay({
          nombre: PagosOps.efectivo,
          cantidad: pago.importeMonedaNacional,
          clave: TipoPago.efectivo,
          formaDePago: pago
        });

        this._pagosMaster.addPago(pagoDisplay);

        this.formasPagoMenu.bloqueaBtn(FlujoBloqueo.efectivoAgregado);
        this.closeModal();
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

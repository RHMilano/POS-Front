import {Component, Input, OnInit} from '@angular/core';
import {FormaPagoUtilizado} from '../../../Models/Pagos/FormaPagoUtilizado';
import {AlertService} from '../../../services/alert.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {CambioPagos, PagosOps, TipoPago, TipoPagoAccesoBoton, TipoVenta} from '../../../shared/GLOBAL';
import {PagosToDisplay} from '../../../Models/Pagos/PagosToDisplay';
import {PagosMasterService} from '../../../services/pagos-master.service';
import {SalesService} from '../../../services/sales.service';
import {FormaPagoResponse} from '../../../Models/Pagos/FormaPagoResponse';
import {FormasPagoMenuComponentInterface} from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import {DescuentoPromocionalLineaModel} from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import {DescuentoPromocionalVentaModel} from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import {Decimal} from 'decimal.js';
import {DescuentoPromocionalAplicado} from '../../../Models/Sales/DescuentoPromocionalAplicado';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-pago-vales',
  templateUrl: './pago-vales.component.html',
  styleUrls: ['./pago-vales.component.css'],
  providers: [SalesService]
})
export class PagoValesComponent implements OnInit {
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  tipoPago = TipoPagoAccesoBoton.vales;
  recibido: number;
  totalToPay = 0;
  montoMaximoCambioVales = 0;
  tipoVale: string;
  toDisable: boolean;
  SelectVale;
  vales: Array<FormaPagoResponse>;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;
  selectedVale: string;
  totalTicket: number;

  constructor(public  modalRef: BsModalRef, private modalService: BsModalService, private alertService: AlertService,
              private _pagosMaster: PagosMasterService, private serviceVales: SalesService) {
                
  }

  ngOnInit() {
    this.vales = [];
    this.selectedVale = null;
    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast);
    this.montoMaximoCambioVales = Number(this.formasPagoMenu.currentConfig.montoMaximoCambioVales);
    const pago = ['vales'];
    CambioPagos[pago[0]] = this.montoMaximoCambioVales;
    this.toDisable = true;
    if ('totalizarApartado' in this.formasPagoMenu.currentTotalizarInfo) {
      this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.informacionAsociadaFormasPago.forEach(pagoVal => {
        if (this.checkValeTipo(pagoVal.codigoFormaPago)) {
          const vale = new FormaPagoResponse();
          vale.codigoFormaPago = pagoVal.codigoFormaPago;
          vale.descripcionCorta = pagoVal.descripcionFormaPago;
          this.vales.push(vale);
        }
      });
    } else {
      this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.informacionAsociadaFormasPago.forEach(pagoVal => {
        if (this.checkValeTipo(pagoVal.codigoFormaPago)) {
          const vale = new FormaPagoResponse();
          vale.codigoFormaPago = pagoVal.codigoFormaPago;
          vale.descripcionCorta = pagoVal.descripcionFormaPago;
          this.vales.push(vale);
        }
      });
    }
   /* this.serviceVales.getValesService().subscribe(data => {
      if (data.length) {
        data.forEach(item => {
          this.vales.push(item);
        });
      }
    });
*/
    this.totalTicket = this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.totalTicket;

  }

  cancelPay() {
    this.closeModal();
  }

  closeModal() {
    // this.formasPagoMenu.closeModal();
    this.modalRef.hide();
  }

  validatePay() {
    if (!this.recibido || Number(this.recibido) === 0 || Number(this.recibido) <= 0 || !this.SelectVale) {
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
        const recibido = Number(this.recibido);
        this.tipoPago = this.SelectVale;
        const pago = new FormaPagoUtilizado();
        pago.importeMonedaNacional = recibido;
        pago.codigoFormaPagoImporte = TipoPago['vale' + this.SelectVale];
        pago.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
        pago.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };


        if (pago.importeCambioExcedenteMonedaNacional !== 0) {
          this.alertService.show({mensaje: 'El monto máximo de cambio es de 1', titulo: 'Milano', tipo: 'warning'});
        }

        const aplicaPromoPosibleLinea = this.promocionesPosiblesLinea.find(
          promoPosible => promoPosible.descuentosPromocionalesFormaPago.findIndex(formaPago => formaPago.codigoFormaPago === this.SelectVale) !== -1);
        const aplicaPromoPosibleVenta = this.promocionesPosiblesVenta.find(
          promoPosible => promoPosible.descuentosPromocionalesFormaPago.findIndex(formaPago => formaPago.codigoFormaPago === this.SelectVale) !== -1);


        if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones &&  this.totalAplicandoPromociones.comparedTo(this.recibido) <= 0
          && (aplicaPromoPosibleLinea || aplicaPromoPosibleVenta)
        ) {
          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);


          pago.descuentosPromocionalesPorVentaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago['vale' + this.SelectVale];
              return descuentoAplicado;
            })
          };

          pago.descuentosPromocionalesPorLineaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago['vale' + this.SelectVale];
              return descuentoAplicado;
            })
          };

        }


        const pagoDisplay = new PagosToDisplay({
          nombre: PagosOps['vale' + this.SelectVale],
          cantidad: pago.importeMonedaNacional,
          clave: TipoPago['vale' + this.SelectVale],
          formaDePago: pago
        });

        this._pagosMaster.addPago(pagoDisplay);

        this.closeModal();
      }
    }
  }

  getPromocionesPosibles(promociones: {
    promocionesPosiblesAplicablesLinea: Array<DescuentoPromocionalVentaModel>,
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
      TipoPago.valeV9 === valeName
    ) {
      return true;
    }
    return false;
  }

  setSelectedVale(vale) {
    this.selectedVale = vale;
  }
}

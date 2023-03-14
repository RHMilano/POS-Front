import {Component, HostListener, Input, OnInit} from '@angular/core';
import {TipoPagoAccesoBoton} from '../../../shared/GLOBAL';
import {DescuentoPromocionalLineaModel} from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import {DescuentoPromocionalVentaModel} from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import {DescuentoPromocionalAplicado} from '../../../Models/Sales/DescuentoPromocionalAplicado';
import {Decimal} from 'decimal.js';
import {FormasPagoMenuComponentInterface} from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {NotasDeCreditoComponent} from '../notas-de-credito/notas-de-credito.component';
import {BusquedaClienteFinLagComponent} from './busqueda-cliente/busqueda-cliente-finLag.component';
import {PagosMasterService} from '../../../services/pagos-master.service';
import {SalesService} from '../../../services/sales.service';
import {ValidaValeRequest} from '../../../Models/Pagos/ValidaValeRequest';
import {AlertService} from '../../../services/alert.service';
import {PagoFinLagComponent} from './pago-fin-lag/pago-fin-lag.component';

@Component({
  selector: 'app-fin-lag',
  templateUrl: './fin-lag.component.html',
  styleUrls: ['./fin-lag.component.css'],
  providers: [ SalesService ]
})
export class FinLagComponent implements OnInit {

  idDistribuidor: number;
  folio: string;
  recibido: number;
  totalToPay = 0;
  tipoPago = TipoPagoAccesoBoton.finLag;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;
  toDisable: boolean;
  infoVale: boolean;
  montoVale: number;
  montoValeComp: number;
  montoMinimo: number;
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;

  constructor(public modalRef: BsModalRef, public modalService: BsModalService, private _pagosMaster: PagosMasterService,
              private alertService: AlertService, private _salesService: SalesService) { }

  ngOnInit() {
    this.formasPagoMenu.blockPagos();
    this.montoMinimo  = 200;
    this.infoVale = true;
    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast);
    this.toDisable = true;
  }

  addPay() {

  }

  cancelPay() {
    this.closeModal();
    this.formasPagoMenu.selectOperation('reset');
  }

  closeModal() {
    this.formasPagoMenu.closeModal();
  }

  validateInfo() {
    if (!this.folio || (!this.recibido || this.recibido <= 0) || (this.recibido < this.montoMinimo) || (this.montoVale && this.montoValeComp < this.recibido )){
      return false;
    } else {
      return true;
    }
  }

  montoVal() {
    this.montoValeComp = Number(this.montoVale);
  }

  validate() {
    this.toDisable = false;
    if (!this.recibido || !this.folio) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto y folio'});
      this.toDisable = true;
      return;
    } else {
      if (Number(this.recibido) === 0 || Number(this.recibido) <= 0) {
        this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto válido'});
        this.toDisable = true;
      } else if (this.montoVale && this.montoValeComp < Number(this.recibido) ) {
        this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'El monto a pagar no puede ser mayor al monto del vale'});
        this.toDisable = true;
      } else if (this.totalToPay < Number(this.recibido) ) {
        this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'El monto no puede ser mayor al total'});
        this.toDisable = true;
      } else if (Number(this.recibido) < this.montoMinimo) {
        this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'El monto mínimo para realizar una venta con Finlag es de $200.00'});
        this.toDisable = true;
      } else {
        this.infoVale = false;
        this.closeModal();
        const vale = new ValidaValeRequest();
        vale.folioVale = this.folio;
        vale.idDistribuidora = this.idDistribuidor ? this.idDistribuidor : 0;
        vale.montoVale = this.montoVale ? this.montoVale : 0;
        this._salesService.validaValeService(vale).subscribe(response => {
          if(Number(response.NumeroCodigo) === 4 || Number(response.NumeroCodigo) === 28 || Number(response.NumeroCodigo) === 46
          || Number(response.NumeroCodigo) === 49 || Number(response.NumeroCodigo) === 52) {
            const initialState = {formasPagoMenu: this.formasPagoMenu};
            const options: ModalOptions = {
              class: 'modal-max',
              backdrop: 'static',
              keyboard: false,
              initialState: {
                formasPagoMenu: this.formasPagoMenu,
                valeInfo: response,
                vale: vale,
                recibido: this.recibido
              }
            };
            this.modalRef = this.modalService.show(BusquedaClienteFinLagComponent, options);
          } else {
            this.alertService.show({mensaje: response.DescripcionCodigo, tipo: 'error', titulo: 'Milano'});
            this.cancelPay();
          }
        });
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    const keyCode = event.which || event.keyCode;

    if (keyCode === 27 && !this.alertService.activeRequests.length) {
      this.cancelPay();
    }
  }
}

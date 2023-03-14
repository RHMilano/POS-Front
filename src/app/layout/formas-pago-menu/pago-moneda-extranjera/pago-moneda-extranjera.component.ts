import { Component, Input, OnInit } from '@angular/core';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { AlertService } from '../../../services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DivisasRequest } from '../../../Models/General/DivisasRequest';
import { GeneralService } from '../../../services/general.service';
import {CambioPagos, PagosOps, TipoDivisaDesc, TipoPago, TipoPagoAccesoBoton} from '../../../shared/GLOBAL';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';
import { Decimal } from 'decimal.js/decimal';
import { PagosMasterService } from '../../../services/pagos-master.service';
import { TipoDivisasResponse } from '../../../Models/General/TipoDivisasResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import {DescuentoPromocionalLineaModel} from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import {DescuentoPromocionalVentaModel} from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import {DescuentoPromocionalAplicado} from '../../../Models/Sales/DescuentoPromocionalAplicado';
import {DosDecimalesPipe} from '../../../pipes/dos-decimales.pipe';

@Component({
  selector: 'app-pago-moneda-extranjera',
  templateUrl: './pago-moneda-extranjera.component.html',
  styleUrls: ['./pago-moneda-extranjera.component.css'],
  providers: [GeneralService, DosDecimalesPipe]
})
export class PagoMonedaExtranjeraComponent implements OnInit {
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  tipoPago = TipoPagoAccesoBoton.monedaExtranjera;
  selectMon;
  recibido: number;
  totalToPay = 0;
  montoMaximoMovimientoDolaresTransaccion = 0;
  montoMaximoCambioDolaresTransaccion = 0;
  totalPaidMonedaEx;
  mensajeValidacion: string;
  totalToPaidMonedaExtranjera = {
    total: 0,
    tasa: 0
  };

  monedas: TipoDivisasResponse[];
  actualiza: number = 0;
  codigoDivisa: TipoPago;
  tipoDivisa: TipoPago;
  divisaNombre: TipoDivisaDesc;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;
  selectedVale: string;

  constructor(private modalService: BsModalService
    , private alertService: AlertService
    , private generalService: GeneralService
    , private _pagosMaster: PagosMasterService
    , private dosDecimales: DosDecimalesPipe) {
  }

  ngOnInit() {

    this.totalPaidMonedaEx = 0;

    this.monedas = [];

    this.totalToPay = Number(
      this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast
    ); // Total a pagar;

    this.recibido = this.dosDecimales.calc(this.totalToPay);

    //    this.montoMaximoMovimientoDolaresTransaccion = Number(this.formasPagoMenu.currentConfig.montoMaximoMovimientoDolaresTransaccion);
    // this.montoMaximoCambioDolaresTransaccion = Number(this.formasPagoMenu.currentConfig.montoMaximoCambioDolaresTransaccion);
    this.getTipoMonedas();
  }

  cancelPay() {
    this.modalService._hideModal(1);
  }

  closeModal() {
    this.formasPagoMenu.closeModal();
  }

  validatePay() {

    //debugger;
    const selDiv = this.codigoDivisa;
    this._pagosMaster.PagosMaster.getPagosMonedaExtranjera().forEach(pago => {
      if (selDiv === pago.clave) {
        this.totalPaidMonedaEx += pago.cantidadMonedaExtranjera;
      }
    });
    const recibido = Number(this.recibido || 0);
    const totalPagado = this.totalPaidMonedaEx;
    const totalMonedaExtranjera = Number(recibido) + Number(totalPagado);

    if (recibido <= 0) {
      this.mensajeValidacion = 'Ingrese un monto mayor a 0.';
      return false;
    }

    if (!this.codigoDivisa) {
      return false;
    }

    if (totalMonedaExtranjera > this.montoMaximoMovimientoDolaresTransaccion) {
      this.mensajeValidacion = 'Monto excede el m\u00E1ximo permitido a pagar.';
      return false;
    }

    if ((totalMonedaExtranjera - this.totalToPaidMonedaExtranjera.total) > this.montoMaximoCambioDolaresTransaccion) {
      this.mensajeValidacion = 'Monto de cambio excede al m\u00E1ximo permitido.';
      return false;
    }

    this.mensajeValidacion = null;
    return true;
  }

  addPay() {

    if (!this.recibido) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto'});
      return;
    } else {
      if (Number(this.recibido) === 0 || Number(this.recibido) <= 0) {
        this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto válido'});
      } else {
        if (this.validatePay()) {
          
          //Realizar conversion a pesos
          const recibido = new Decimal(
            new Decimal(this.recibido).toNumber() * this.totalToPaidMonedaExtranjera.tasa
          ).toFixed(2);

          const maximoCambio = this.montoMaximoCambioDolaresTransaccion * this.totalToPaidMonedaExtranjera.tasa;


          const pago = new FormaPagoUtilizado();
          pago.importeMonedaNacional = Number(recibido);
          pago.codigoFormaPagoImporte = this.codigoDivisa;
          pago.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
          pago.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };

          const aplicaPromoPosibleLinea = this.promocionesPosiblesLinea.find(
            promoPosible => promoPosible.descuentosPromocionalesFormaPago.findIndex(formaPago => formaPago.codigoFormaPago === this.codigoDivisa) !== -1);
          const aplicaPromoPosibleVenta = this.promocionesPosiblesVenta.find(
            promoPosible => promoPosible.descuentosPromocionalesFormaPago.findIndex(formaPago => formaPago.codigoFormaPago === this.codigoDivisa) !== -1);


          if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones &&  this.totalAplicandoPromociones.comparedTo(this.recibido) <= 0
            && (aplicaPromoPosibleLinea || aplicaPromoPosibleVenta)
          ) {

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

          pago.informacionTipoCambio = {
            codigoTipoDivisa: this.codigoDivisa,
            importeMonedaExtranjera: Number(this.recibido),
            tasaConversionVigente: this.totalToPaidMonedaExtranjera.tasa
          };

          const pagoDisplay = new PagosToDisplay(
            {
              nombre: PagosOps.monedaExtranjera,
              nombreCompuesto: `${PagosOps.monedaExtranjera.toString()} ${this.divisaNombre}`,
              cantidad: pago.importeMonedaNacional,
              cantidadMonedaExtranjera: Number(this.recibido),
              clave: this.codigoDivisa,
              formaDePago: pago
            }
          );

          this._pagosMaster.addPago(pagoDisplay);

          this.closeModal();
        }
      }
    }
  }

  getTipoMonedas() {
    this.monedas = [];
    this.generalService.getTipoDivisas().subscribe(
      data => {
        if (data.length) {
          data.forEach(index => {
            this.monedas.push(index);
            TipoPago[index.descripcion.toLowerCase()] = index.codigo;
            TipoDivisaDesc[index.descripcion.toLowerCase().trim()] = index.descripcion;
            const desc = index.descripcion.toLowerCase().split(' ');
            CambioPagos[desc[0]] = index.montoMaximoCambioDivisaTransaccion;
          });
        }
      }
    );
  }

  seleccionDivisa(moneda: TipoDivisasResponse) {


    const divReq = new DivisasRequest();
    divReq.codigoTipoDivisa = moneda.codigo;
    divReq.importeMonedaNacional = this.totalToPay;

    if (moneda.codigo === TipoPago.quetzales) {
      this.codigoDivisa = TipoPago.quetzales;
      this.tipoDivisa = TipoPago.quetzales;
      this.divisaNombre = TipoDivisaDesc.quetzales;
    } else {
      this.codigoDivisa = TipoPago.dolares;
      this.tipoDivisa = TipoPago.dolares;
      this.divisaNombre = TipoDivisaDesc.dolares;
    }

    this.montoMaximoCambioDolaresTransaccion = 0.00; // moneda.montoMaximoCambioDivisaTransaccion;
    this.montoMaximoMovimientoDolaresTransaccion =  0.00; // moneda.montoMaximoMovimientoDivisaTransaccion;

    this.selectedVale = this.codigoDivisa;

    this.getConvertionMonedaExtranjera(divReq);
  }

  getConvertionMonedaExtranjera(divisa) {

    this.generalService.getConvertirDivisa(divisa).subscribe(
      resp => {
        if (!resp.data) {
          this.closeModal();
        } else {
          this._pagosMaster.PagosMaster.setDivisas(resp.data);
          this.totalToPaidMonedaExtranjera.total = Number(resp.data.importeMonedaExtranjera);
          this.totalToPaidMonedaExtranjera.tasa = Number(resp.data.tasaConversionVigente);
          //debugger;
          this.montoMaximoCambioDolaresTransaccion = Number(resp.data.montoMaximoCambio);
          this.montoMaximoMovimientoDolaresTransaccion =  Number(resp.data.montoMaximoRecibir);


          this.recibido = this.totalToPaidMonedaExtranjera.total;
        }
      }, (err: HttpErrorResponse) => {
        this.closeModal();
      });
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

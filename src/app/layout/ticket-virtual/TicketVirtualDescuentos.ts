import { TicketVirtual } from './TicketVirtual';
import { GLOBAL } from '../../shared/GLOBAL';
import { ConfigGeneralesCajaTiendaImpuestoModel } from '../../Models/General/ConfigGeneralesCajaTiendaImpuesto.model';
import { Decimal } from 'decimal.js/decimal';
import { DescuentoPromocionalVentaModel } from '../../Models/Pagos/DescuentoPromocionalVenta.model';
import { DescuentoPromocionalLineaModel } from '../../Models/Sales/DescuentoPromocionalLinea.model';

export class TicketVirtualDescuentos {
  private _ticketVirtual: TicketVirtual;

  /*** **/


  constructor(ticketVirtual: TicketVirtual) {
    this._ticketVirtual = ticketVirtual;
  }

  private _totalDescuentosAplicados: Decimal = new Decimal(0);

  get totalDescuentosAplicados(): Decimal {
    return this._totalDescuentosAplicados;
  }

  set totalDescuentosAplicados(value: Decimal) {
    this._totalDescuentosAplicados = value;
  }

  private _descuentosPosiblesLinea: Array<DescuentoPromocionalVentaModel> = [];

  get descuentosPosiblesLinea(): Array<DescuentoPromocionalVentaModel> {
    return this._descuentosPosiblesLinea;
  }

  set descuentosPosiblesLinea(value: Array<DescuentoPromocionalVentaModel>) {
    this._descuentosPosiblesLinea = value;
  }

  /** Descuentos Aplicados Venta y Linea **/

  private _descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalVentaModel> = [];

  get descuentosPromocionalesAplicadosVenta(): Array<DescuentoPromocionalVentaModel> {
    return this._descuentosPromocionalesAplicadosVenta;
  }

  set descuentosPromocionalesAplicadosVenta(value: Array<DescuentoPromocionalVentaModel>) {
    this._descuentosPromocionalesAplicadosVenta = value;
  }

  private _descuentosPromocionalesPosiblesAplicadosVenta: Array<DescuentoPromocionalVentaModel> = [];

  get descuentosPromocionalesPosiblesAplicadosVenta(): Array<DescuentoPromocionalVentaModel> {
    return this._descuentosPromocionalesPosiblesAplicadosVenta;
  }

  set descuentosPromocionalesPosiblesAplicadosVenta(value: Array<DescuentoPromocionalVentaModel>) {
    this._descuentosPromocionalesPosiblesAplicadosVenta = value;
  }

  private _descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalLineaModel> = [];

  get descuentosPromocionalesAplicadosLinea(): Array<DescuentoPromocionalLineaModel> {
    return this._descuentosPromocionalesAplicadosLinea;
  }

  set descuentosPromocionalesAplicadosLinea(value: Array<DescuentoPromocionalLineaModel>) {
    this._descuentosPromocionalesAplicadosLinea = value;
  }

  private _descuentosPromocionalesPosiblesAplicadosLinea: Array<DescuentoPromocionalLineaModel> = [];

  get descuentosPromocionalesPosiblesAplicadosLinea(): Array<DescuentoPromocionalLineaModel> {
    return this._descuentosPromocionalesPosiblesAplicadosLinea;
  }

  set descuentosPromocionalesPosiblesAplicadosLinea(value: Array<DescuentoPromocionalLineaModel>) {
    this._descuentosPromocionalesPosiblesAplicadosLinea = value;
  }

  /** Variable de transicion **/
  private _descuentosPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];

  get descuentosPosiblesVenta(): Array<DescuentoPromocionalVentaModel> {
    return this._descuentosPosiblesVenta;
  }

  set descuentosPosiblesVenta(value: Array<DescuentoPromocionalVentaModel>) {
    this._descuentosPosiblesVenta = value;
  }

  private _descuentosPromocionalesPosiblesAplicadosVentaMM: Array<DescuentoPromocionalVentaModel> = [];

  get descuentosPromocionalesPosiblesAplicadosVentaMM(): Array<DescuentoPromocionalVentaModel> {
    return this._descuentosPromocionalesPosiblesAplicadosVentaMM;
  }

  set descuentosPromocionalesPosiblesAplicadosVentaMM(value: Array<DescuentoPromocionalVentaModel>) {
    this._descuentosPromocionalesPosiblesAplicadosVentaMM = value;
  }


  applyDescuentosAplicadosVenta(descuentos: Array<DescuentoPromocionalVentaModel>) {

    this.descuentosPromocionalesAplicadosVenta = descuentos || [];

    const informacionImpuesto = <ConfigGeneralesCajaTiendaImpuestoModel>GLOBAL.informacionAsociadaImpuestos;
    const impuesto = informacionImpuesto.porcentajeImpuesto;

    this.descuentosPromocionalesAplicadosVenta.forEach(descuentoAplicado => {
      const totalTicket = new Decimal(this._ticketVirtual.totalTicket).minus(descuentoAplicado.importeDescuento);
      const descuentoImpuestos = totalTicket.minus(totalTicket.div(new Decimal(impuesto).div(100).plus(1)));
      this._ticketVirtual.totalTicket = this._ticketVirtual.totalSale = totalTicket.toNumber();
      this._ticketVirtual.totalTax = descuentoImpuestos.toNumber();
      this.totalDescuentosAplicados = this.totalDescuentosAplicados.plus(descuentoAplicado.importeDescuento);
    });

    if (this._ticketVirtual.isDevolucion && this._ticketVirtual.totalTicket < 0) {
      this._ticketVirtual.totalTicketFavorDiferencia = this._ticketVirtual.totalTicket * -1;
      this._ticketVirtual.totalTicket = 0;
      this._ticketVirtual.totalTax = this._ticketVirtual.totalTax * -1;
      this._ticketVirtual.totalSale = this._ticketVirtual.totalSale * -1;
      this._ticketVirtual.cabeceraVenta.devolucionSaldoAFavor = this._ticketVirtual.totalTicketFavorDiferencia;
      this._ticketVirtual.cabeceraVenta.importeDevolucionTotal = this._ticketVirtual.totalTicket;
    }
  }

  applyDescuentosAplicadosLinea(descuentos: Array<DescuentoPromocionalVentaModel>) {

    this.descuentosPromocionalesAplicadosLinea = descuentos || [];

    this.descuentosPromocionalesAplicadosLinea.forEach(descuento => {
      const ticketRow = this._ticketVirtual.ticketRow.find(ticketRows => ticketRows.lineaTicket.secuencia === descuento.secuencia);
      ticketRow.lineaTicket.descuentosPromocionalesAplicadosLinea.push(descuento);
      ticketRow.updateGrandTotal();
      this.totalDescuentosAplicados = this.totalDescuentosAplicados.plus(descuento.importeDescuento);
    });


    this._ticketVirtual.calculateTotal();

  }


  applyDescuentosPosiblesLinea(descuentos: Array<DescuentoPromocionalLineaModel>) {
    this.descuentosPromocionalesPosiblesAplicadosLinea = descuentos || [];

    const informacionImpuesto = <ConfigGeneralesCajaTiendaImpuestoModel>GLOBAL.informacionAsociadaImpuestos;
    const impuesto = informacionImpuesto.porcentajeImpuesto;


    this.descuentosPromocionalesPosiblesAplicadosLinea.forEach(descuentoAplicado => {
      const totalTicket = new Decimal(this._ticketVirtual.totalTicket).minus(descuentoAplicado.importeDescuento);
      const descuentoImpuestos = totalTicket.minus(totalTicket.div(new Decimal(impuesto).div(100).plus(1)));
      this._ticketVirtual.totalTicket = this._ticketVirtual.totalSale = totalTicket.toNumber();
      this._ticketVirtual.totalTax = descuentoImpuestos.toNumber();
      this.totalDescuentosAplicados = this.totalDescuentosAplicados.plus(descuentoAplicado.importeDescuento);
    });

  }

  applyDescuentosPosiblesVenta(descuentos: Array<DescuentoPromocionalVentaModel>) {
    this.descuentosPromocionalesPosiblesAplicadosVenta = descuentos || [];
    const informacionImpuesto = <ConfigGeneralesCajaTiendaImpuestoModel>GLOBAL.informacionAsociadaImpuestos;
    const impuesto = informacionImpuesto.porcentajeImpuesto;


    this.descuentosPromocionalesPosiblesAplicadosVenta.forEach(descuentoAplicado => {
      const totalTicket = new Decimal(this._ticketVirtual.totalTicket).minus(descuentoAplicado.importeDescuento);
      const descuentoImpuestos = totalTicket.minus(totalTicket.div(new Decimal(impuesto).div(100).plus(1)));
      this._ticketVirtual.totalTicket = this._ticketVirtual.totalSale = totalTicket.toNumber();
      this._ticketVirtual.totalTax = descuentoImpuestos.toNumber();
      this.totalDescuentosAplicados = this.totalDescuentosAplicados.plus(descuentoAplicado.importeDescuento);
    });
  }

  applyDescuentosPosiblesVentaMM(descuentos: Array<DescuentoPromocionalVentaModel>) {

    // console.log('Entra en: applyDescuentosPosiblesVentaMM');

    this.descuentosPromocionalesPosiblesAplicadosVentaMM = descuentos || [];
    const informacionImpuesto = <ConfigGeneralesCajaTiendaImpuestoModel>GLOBAL.informacionAsociadaImpuestos;
    const impuesto = informacionImpuesto.porcentajeImpuesto;

    this.descuentosPromocionalesPosiblesAplicadosVentaMM.forEach(descuentoAplicado => {
      //console.log(`this._ticketVirtual.totalTicket: ${this._ticketVirtual.totalTicket}`);
      //console.log(`descuentoAplicado.importeDescuento: ${descuentoAplicado.importeDescuento}`);
      const totalTicket = new Decimal(this._ticketVirtual.totalTicket).minus(descuentoAplicado.importeDescuento);

      //console.log(`totalTicket: ${totalTicket}`);

      const descuentoImpuestos = totalTicket.minus(totalTicket.div(new Decimal(impuesto).div(100).plus(1)));
      this._ticketVirtual.totalTicket = this._ticketVirtual.totalSale = totalTicket.toNumber();
      this._ticketVirtual.totalTax = descuentoImpuestos.toNumber();
      this.totalDescuentosAplicados = this.totalDescuentosAplicados.plus(descuentoAplicado.importeDescuento);
    });

  }

  getPromocionesAplicadasTotalizar(): Array<DescuentoPromocionalVentaModel> {

    return [...this.descuentosPromocionalesAplicadosVenta];

  }

  resetDescuentos() {
    this.totalDescuentosAplicados = new Decimal(0);
    this.descuentosPromocionalesPosiblesAplicadosVenta = [];
    this.descuentosPromocionalesPosiblesAplicadosLinea = [];
    this.descuentosPromocionalesAplicadosLinea = [];
    this.descuentosPromocionalesAplicadosVenta = [];
    this.descuentosPromocionalesPosiblesAplicadosVentaMM = [];
  }

  resetCalculo() {
    this.descuentosPromocionalesPosiblesAplicadosVenta = [];
    this.descuentosPromocionalesPosiblesAplicadosLinea = [];
    this._ticketVirtual.calculateTotal();
    this.applyDescuentosAplicadosVenta(this.descuentosPromocionalesAplicadosVenta);
    this.applyDescuentosPosiblesVentaMM(this.descuentosPromocionalesPosiblesAplicadosVentaMM);
  }

  getTotalDescuentosAplicados(): number {
    return this._totalDescuentosAplicados.toNumber();
  }

  showTotalDescuentos(): boolean {
    return !!this._totalDescuentosAplicados.toNumber();
  }

}

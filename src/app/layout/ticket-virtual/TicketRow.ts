import { GLOBAL, TipoDescuento, TiposProductos } from '../../shared/GLOBAL';
import { Descuento } from '../../Models/Sales/Descuento.model';
import { LineaTicket } from '../../Models/Sales/LineaTicket';
import { ArticuloComponent } from './articulo/articulo.component';

export class TicketRow {
  lineaTicket: LineaTicket;
  sku: number;
  estilo: string;
  price: number;
  tax: number;
  rowTotal: number;
  grandTotal: number;
  tipoProducto: TiposProductos;
  priceChanged: boolean;
  discountAdded: boolean;
  discountTxAdded: boolean;
  discountPicos: boolean;
  discountDanio: boolean;
  arrayPosition: number;
  articuloComponentInstance: ArticuloComponent;

  constructor(lineaTicket: LineaTicket, arrayPosition: number) {
    this.lineaTicket = lineaTicket;
    this.updateGrandTotal();
    this.setLabels();
    this.tipoProducto = GLOBAL.getArticuloType(this.lineaTicket.articulo);
    this.arrayPosition = arrayPosition;


    if (this.lineaTicket.articulo.precioCambiadoConImpuestos && this.lineaTicket.articulo.precioCambiadoConImpuestos !== 0) {
      this.priceChanged = true;
    }

    if (this.lineaTicket.descuentoDirectoLinea) {
      this.discountTxAdded = this.lineaTicket.descuentoDirectoLinea.tipoDescuento === TipoDescuento.importeTransaccion
        || this.lineaTicket.descuentoDirectoLinea.tipoDescuento === TipoDescuento.porcentajeTransaccion;
      this.discountAdded = this.lineaTicket.descuentoDirectoLinea.tipoDescuento === TipoDescuento.importe
        || this.lineaTicket.descuentoDirectoLinea.tipoDescuento === TipoDescuento.importeTransaccion;
    }
  }

  get getCurrentQty() {
    return this.lineaTicket.cantidadVendida;
  }

  //OCG: Seteo de valores para el descuento por transacción
  setLabels() {
    this.sku = this.lineaTicket.articulo.sku;
    this.estilo = this.lineaTicket.articulo.estilo;
    this.price = this.lineaTicket.articulo.getPrecioConImpuestos().toNumber();
    this.tax = this.lineaTicket.articulo.getImpuestoTotal().toNumber();

    //OCG: console.log(`this.sku: ${this.sku} | this.precio ${this.price} | this.tax: ${this.tax}`);
  }

  updateGrandTotal() {
    this.rowTotal = this.lineaTicket.getLineaTotal().toNumber();
    this.grandTotal = this.lineaTicket.getGrandTotal().toNumber();
  }

  updatePrice(newPrice: number) {
    this.priceChanged = true;
    this.lineaTicket.updatePrice(newPrice);
    this.setLabels();
    this.updateGrandTotal();
    return newPrice;
  }

  applyDiscount(descuento: Descuento) {
    this.lineaTicket.descuentoDirectoLinea = new Descuento(descuento);
    this.discountAdded = true;

    this.discountPicos = descuento.tipoDescuento === TipoDescuento.picos;
    this.discountDanio = descuento.tipoDescuento === TipoDescuento.danada;

    this.setLabels();
    this.updateGrandTotal();
  }

  applyDiscountTx(descuento: Descuento) {
    this.lineaTicket.descuentoDirectoLinea = new Descuento(descuento);
    this.discountTxAdded = true;
    this.setLabels();
    this.updateGrandTotal();
  }

  removePromocionesFromLinea() {
    this.lineaTicket.descuentosPromocionalesAplicadosLinea = [];
    this.lineaTicket.descuentosPromocionalesPosiblesLinea = [];
  }

  hasPromociones(): boolean {
    return !!this.lineaTicket.descuentosPromocionalesAplicadosLinea.length || !!this.lineaTicket.descuentosPromocionalesAplicadosLinea.length;
  }
}

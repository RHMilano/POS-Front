import { ProductsResponse } from '../../Models/General/ProductsResponse.model';
import { TicketRow } from './TicketRow';
import { GLOBAL, TipoCabeceraTotalizar, TipoDetalleVenta, TiposProductos, TipoVenta } from '../../shared/GLOBAL';
import { Descuento } from '../../Models/Sales/Descuento.model';
import { isNumber } from 'util';
import { LineaTicket, LineaTicketDevolucion } from '../../Models/Sales/LineaTicket';
import { CabeceraVentaRequest } from '../../Models/Sales/CabeceraVentaRequest';
import { LineaTicketModel } from '../../Models/Sales/LineaTicket.model';
import { VentaResponseModel } from '../../Models/Sales/VentaResponse.model';
import { OperacionLineaTicketVentaResponse } from '../../Models/Sales/OperacionLineaTicketVentaResponse';
import { Articulo } from './articulo/Articulo';
import { ArticuloModel } from '../../Models/Sales/Articulo.model';
import { TicketVirtualDescuentos } from './TicketVirtualDescuentos';
import { Decimal } from 'decimal.js/decimal';


export interface GetLineaTicketFromTicket {
  lineaTicket: LineaTicket;
  isNewItem: boolean;
}

export class TicketVirtual {
  ticketRow: Array<TicketRow> = [];
  ticketRowDevolucion: Array<TicketRow> = [];
  ticketDescuentos: TicketVirtualDescuentos;
  totalSale: number;
  totalTax: number;
  totalTicket: number;
  totalTicketOriginal: number;
  totalTicketFavor: number;
  totalTicketFavorDiferencia: number;
  totalPaid: number;
  change: number;
  totalItems: number;
  totalPrendas: number;
  tipoItems: TiposProductos = TiposProductos.prenda;
  showSkuField = true;
  showTotalPrendas: boolean;
  currentSelection: number;
  currentSelectionDevolucion: number;
  cabeceraVenta: CabeceraVentaRequest = new CabeceraVentaRequest();
  secuencia: number;
  discountTxTicketRow: Array<TicketRow>;
  isTotalizado: boolean;
  tipoTicketVirtual: TipoCabeceraTotalizar;
  isDevolucion: boolean;

  constructor(venta?: VentaResponseModel) {
    this.totalTicket = 0;
    this.totalTicketFavor = 0;
    this.totalSale = 0;
    this.totalTax = 0;
    this.change = 0;
    this.totalItems = 0;
    this.totalPrendas = 0;
    this.secuencia = 0;
    this.isTotalizado = false;
    this.totalTicketFavorDiferencia = 0;

    this.ticketDescuentos = new TicketVirtualDescuentos(this);

    if (venta) {
      this.cargaVentaResponse(venta);
    }
  }

  cargaVentaResponse(venta: VentaResponseModel) {

    this.cabeceraVenta.folioOperacion = venta.folioVenta;
    this.cabeceraVenta.codigoTipoCabeceraVenta = venta.codigoTipoCabeceraVenta;
    this.cabeceraVenta.folioDevolucion = venta.folioDevolucion;
    this.cabeceraVenta.folioVentaOriginal = venta.folioVentaOriginal;
    this.cabeceraVenta.importeVentaNetoOriginal = 0; // venta.importeVentaNetoOriginal;


    this.ticketRowDevolucion = venta.lineasTicket.filter(x => x.perteneceVentaOriginal).map((x, index) => {

      let lineaTicket;
      this.totalTicketOriginal = venta.importeVentaNetoOriginal;
      this.isDevolucion = true;

      lineaTicket = new LineaTicketDevolucion(x, true);

      if (!this.validaTipoProductos(lineaTicket)) {
        return null;
      }
      return new TicketRow(lineaTicket, index);
    });


    this.ticketRow = venta.lineasTicket.filter(x => !x.perteneceVentaOriginal).map((x, index) => {

      let lineaTicket;

      lineaTicket = new LineaTicket(x, true);

      if (!this.validaTipoProductos(lineaTicket)) {
        return null;
      }
      return new TicketRow(lineaTicket, index);
    });

    this.secuencia = venta.consecutivoSecuencia - 1;
    this.setShowTotalPrendas();
    this.calculateTotal();


  }

  cargaArticuloMayorista(articulo: ProductsResponse | LineaTicket) {
    const lineaTicket: LineaTicket = !GLOBAL.isLineaTicket(articulo) ? new LineaTicket({
      articulo: new Articulo(articulo.articulo)
    }, true) : articulo;

    if (!this.validaTipoProductos(lineaTicket)) {
      return;
    }

    this.ticketRow.push(
      new TicketRow(lineaTicket, this.ticketRow.length)
    );


    this.calculateTotal();
  }

  validaTipoProductos(lineaTicket: LineaTicket | ArticuloModel) {
    let tipoItem;

    if (GLOBAL.isLineaTicket(lineaTicket)) {
      tipoItem = GLOBAL.getArticuloType(lineaTicket.articulo);
    } else {
      tipoItem = GLOBAL.getArticuloType(lineaTicket);
    }

    if (this.totalItems > 0 && tipoItem !== this.tipoItems) { // Si el articulo que ingresa es de diferente tipo, se rechaza

      if (this.tipoItems === TiposProductos.prenda &&
        (tipoItem !== TiposProductos.tarjetaRegalo.toString() && tipoItem !== TiposProductos.lineaSkuMayorista.toString())) {
        return null;
      }

      if (this.tipoItems === TiposProductos.tarjetaRegalo &&
        (tipoItem !== TiposProductos.prenda.toString() && tipoItem !== TiposProductos.lineaSkuMayorista)) {
        return null;
      }

      if (this.tipoItems === TiposProductos.tiempoAire) {
        return null;
      }

      if (this.tipoItems === TiposProductos.servicio && tipoItem !== TiposProductos.lineaComisionServicios) {
        return null;
      }

      if (this.tipoItems === TiposProductos.lineaPagoAMayorista && tipoItem !== TiposProductos.lineaComisionPagoMayorista) {
        return null;
      }
    }

    if (tipoItem === TiposProductos.tiempoAire && this.totalItems > 0) {
      return null;
    }

    if ((tipoItem === TiposProductos.lineaPagoTCMM) && this.totalItems > 0) {
      return null;
    }

    //OCG: Tipo de producto linea de pago web
    if ((tipoItem === TiposProductos.lineaPagoWeb) && this.totalItems > 0) {
      return null;
    }

    this.tipoItems = tipoItem;
    return true;
  }

  getLineaTicket(articulo: ProductsResponse | LineaTicket, tipoVenta?: TipoVenta): GetLineaTicketFromTicket {
    const getLineaTicket: GetLineaTicketFromTicket = {
      isNewItem: false,
      lineaTicket: null
    };

    let codigoTipoDetalleVenta;

    if (!this.validaTipoProductos(articulo.articulo)) {
      return;
    }

    if (tipoVenta) {
      switch (tipoVenta) {
        case TipoVenta.VentaMayorista:
          codigoTipoDetalleVenta = TipoDetalleVenta.agregarLineaMayorista;
          break;
        case TipoVenta.VentaEmpleado:
          codigoTipoDetalleVenta = TipoDetalleVenta.agregarLineaEmpleado;
          break;
        case TipoVenta.Apartado:
          codigoTipoDetalleVenta = TipoDetalleVenta.apartado;
          break;
      }
    }

    switch (this.tipoItems) {
      case TiposProductos.tiempoAire:
        codigoTipoDetalleVenta = TipoDetalleVenta.agregarLineaTiempoAire;
        break;
      case TiposProductos.servicio:
        codigoTipoDetalleVenta = TipoDetalleVenta.agregarLineaServicios;
        break;
      case TiposProductos.lineaComisionServicios:
        codigoTipoDetalleVenta = TipoDetalleVenta.agregarLineaComisionServicios;
        break;
      case TiposProductos.tarjetaRegalo:
        codigoTipoDetalleVenta = TipoDetalleVenta.tarjetaRegaloMM;
        break;
      case TiposProductos.lineaPagoAMayorista:
        codigoTipoDetalleVenta = TipoDetalleVenta.agregarLineaPagoCreditoMayorista;
        break;
      case TiposProductos.lineaComisionPagoMayorista:
        codigoTipoDetalleVenta = TipoDetalleVenta.agregarLineaComisionPagoCreditoMayorista;
        break;
      case TiposProductos.lineaPagoTCMM:
        codigoTipoDetalleVenta = TipoDetalleVenta.tarjetaMM;
        break;
      case TiposProductos.lineaPagoWeb: //OCG
          codigoTipoDetalleVenta = TipoDetalleVenta.pagoWeb;
          break;
    }

    const lineaTicket: LineaTicket = !GLOBAL.isLineaTicket(articulo) ? new LineaTicket({
      articulo: new Articulo(articulo.articulo),
      codigoTipoDetalleVenta: codigoTipoDetalleVenta
    }, true) : articulo;


    let ticketRow: TicketRow;

    const tipoSkipSkuValidation = [TiposProductos.tarjetaRegalo,
      TiposProductos.lineaPagoAMayorista,
      TiposProductos.lineaComisionPagoMayorista,
      TiposProductos.lineaComisionServicios,
      TiposProductos.servicio
    ];

    if (!GLOBAL.includesAny(this.tipoItems, tipoSkipSkuValidation)) {
      ticketRow = <TicketRow>this.ticketRow.find((value) => value.sku === lineaTicket.articulo.sku);
    }

    let lineasTicketCalculo: Array<LineaTicket>;


    if (!!ticketRow) {
      lineaTicket.cantidadVendida = ticketRow.lineaTicket.cantidadVendida + 1;
      lineaTicket.secuencia = ticketRow.lineaTicket.secuencia;
      lineasTicketCalculo = this.generaLineasTicketCambioPieza(ticketRow, lineaTicket);
      getLineaTicket.lineaTicket = lineaTicket;
      getLineaTicket.isNewItem = false;
    } else {
      lineaTicket.secuencia = this.secuencia + 1; // secuencia temporal
      getLineaTicket.lineaTicket = lineaTicket;
      getLineaTicket.isNewItem = true;
      lineasTicketCalculo = [...this.getAllLineaTicket(), lineaTicket];
    }

    this.cabeceraVenta.setImportesFromLineaTicket(lineasTicketCalculo);

    return getLineaTicket;
  }

  generaLineasTicketCambioPieza(ticketRow: TicketRow, newLineaTicket: LineaTicket): Array<LineaTicket> {
    let lineasTicketCalculo: Array<LineaTicket>;
    lineasTicketCalculo = this.getAllLineaTicket().map(x => x);
    lineasTicketCalculo.splice(ticketRow.arrayPosition, 1, newLineaTicket);
    return lineasTicketCalculo;
  }

  generaLineasTicketEliminarLinea(ticketRow: TicketRow): Array<LineaTicket> {
    let lineasTicketCalculo: Array<LineaTicket>;
    lineasTicketCalculo = this.getAllLineaTicket().map(x => x);
    lineasTicketCalculo.splice(ticketRow.arrayPosition, 1);
    return lineasTicketCalculo;
  }

  generaLineasTicketDevolucion(ticketRow: TicketRow, newLineaTicket: LineaTicket): Array<LineaTicket> {
    let lineasTicketCalculo: Array<LineaTicket>;
    lineasTicketCalculo = this.getAllLineaTicketDevolucion().map(x => x);
    lineasTicketCalculo.splice(ticketRow.arrayPosition, 1, newLineaTicket);
    return lineasTicketCalculo;
  }

  generaLineaCambioPrecio(rowNumber: number, newPrice: number): LineaTicket {
    const ticketRow = this.ticketRow[rowNumber];

    const lineaTicketCambioPrecio = new LineaTicket(this.ticketRow[rowNumber].lineaTicket.getLineaTicket());
    lineaTicketCambioPrecio.updatePrice(newPrice);

    const lineasTicketCalculoCabecera = this.generaLineasTicketCambioPieza(ticketRow, lineaTicketCambioPrecio);
    this.cabeceraVenta.setImportesFromLineaTicket(lineasTicketCalculoCabecera);

    return lineaTicketCambioPrecio;
  }

  generaLineaTicketDescuento(rowNumber: number, descuento: Descuento): LineaTicket {

    try {

      const ticketRow = this.getSelectedTicketRow(rowNumber);

      const lineaTicketDescuento = new LineaTicket(ticketRow.lineaTicket.getLineaTicket());
      lineaTicketDescuento.descuentoDirectoLinea = descuento.getDescuento();

      const lineasTicketCalculoCabecera = this.generaLineasTicketCambioPieza(ticketRow, lineaTicketDescuento);
      this.cabeceraVenta.setImportesFromLineaTicket(lineasTicketCalculoCabecera);

      return lineaTicketDescuento;

    } catch (e) {
      //console.log('error =>', e);
      //console.log('rowNumber => ', rowNumber);
    }

  }

  generaLineaTicketDescuentoBySku(sku: number, descuento: Descuento): LineaTicket {

    try {

      const ticketRow = this.findBySku(sku);

      const lineaTicketDescuento = new LineaTicket(ticketRow.lineaTicket.getLineaTicket());
      lineaTicketDescuento.descuentoDirectoLinea = descuento.getDescuento();

      const lineasTicketCalculoCabecera = this.generaLineasTicketCambioPieza(ticketRow, lineaTicketDescuento);
      this.cabeceraVenta.setImportesFromLineaTicket(lineasTicketCalculoCabecera);

      return lineaTicketDescuento;

    } catch (e) {
      //console.log('error =>', e);
      //console.log('sku => ', sku);
    }

  }


  addArticulo(lineaTicket: LineaTicket, resp: OperacionLineaTicketVentaResponse): TicketRow {

    this.cabeceraVenta.folioOperacion = resp.folioOperacion;
    this.secuencia++;

    const ticketRow = new TicketRow(lineaTicket, this.ticketRow.length);
    this.ticketRow.push(ticketRow);
    this.setShowSkuField();
    this.setShowTotalPrendas();
    this.calculateTotal();

    return ticketRow;
  }

  updateLineaTicketCambioPieza(lineaTicket: LineaTicket): TicketRow {
    const ticketRow = this.findBySku(lineaTicket.articulo.sku);
    ticketRow.lineaTicket.cantidadVendida = lineaTicket.cantidadVendida;
    ticketRow.updateGrandTotal();
    this.setShowTotalPrendas();
    this.calculateTotal();
    return ticketRow;
  }

  removeArticulo(articulo: TicketRow) {

    const tipoItem = GLOBAL.getArticuloType(articulo.lineaTicket.articulo);
    let index;
    let predicate;

    if (tipoItem === TiposProductos.tarjetaRegalo) {
      predicate = value => value.lineaTicket.articulo.informacionTarjetaRegalo.folioTarjeta === articulo.lineaTicket.articulo.informacionTarjetaRegalo.folioTarjeta;
    } else {
      predicate = value => value.sku === articulo.sku;
    }

    index = this.ticketRow.findIndex(predicate);
    this.ticketRow.splice(index, 1);
    this.ticketRow.forEach((ticketRow, arrayPos) => ticketRow.arrayPosition = arrayPos);

    this.setShowTotalPrendas();
  }

  removeArticuloByLineaTicket(lineaTicket: LineaTicket) {
    this.removeArticulo(
      this.ticketRow.find(ticketRow => ticketRow.lineaTicket.secuencia === lineaTicket.secuencia)
    );
    this.calculateTotal();
  }

  calculateTotal() {
    //OCG: console.log('Entra a calculateTotal');

    this.totalTicket = 0;
    this.totalSale = 0;
    this.totalTax = 0;
    this.change = 0;
    this.totalItems = 0;
    this.totalPrendas = 0;
    this.totalTicketFavor = 0;

    this.cabeceraVenta.resetImportes();

    this.ticketDescuentos.descuentosPromocionalesAplicadosLinea = [];

    const totalReduce = [...this.ticketRow, ...this.ticketRowDevolucion];

    this.ticketRow.reduce((previousValue, currentValue) => {

      const lineaTicket = currentValue.lineaTicket.getLineaTicket();

      this.totalSale = new Decimal(currentValue.grandTotal).plus(this.totalSale).toNumber();
      this.totalTax = new Decimal(lineaTicket.importeVentaLineaImpuestos1).plus(lineaTicket.importeVentaLineaImpuestos2).plus(this.totalTax).toNumber();
      this.totalTicket = new Decimal(lineaTicket.importeVentaLineaNeto).plus(this.totalTicket).toNumber();
      this.totalItems += Number(currentValue.lineaTicket.cantidadVendida);
      this.totalPrendas += currentValue.tipoProducto === TiposProductos.prenda ? Number(currentValue.lineaTicket.cantidadVendida) : 0;

      this.cabeceraVenta.importeVentaBruto = new Decimal(lineaTicket.importeVentaLineaBruto).plus(this.cabeceraVenta.importeVentaBruto).toNumber();
      this.cabeceraVenta.importeVentaDescuentos = new Decimal(lineaTicket.importeVentaLineaDescuentos).plus(this.cabeceraVenta.importeVentaDescuentos).toNumber();
      this.cabeceraVenta.importeVentaImpuestos =
        new Decimal(lineaTicket.importeVentaLineaImpuestos1).plus(lineaTicket.importeVentaLineaImpuestos2).plus(this.cabeceraVenta.importeVentaImpuestos).toNumber();
      this.cabeceraVenta.importeVentaNeto = new Decimal(lineaTicket.importeVentaLineaNeto).plus(this.cabeceraVenta.importeVentaNeto).toNumber();


      return currentValue;

    }, totalReduce[0]);


    if (this.isDevolucion) {

      this.ticketRowDevolucion.reduce((previousValue, currentValue) => {
        this.totalTicketFavor = currentValue.lineaTicket.getTotalFavor().plus(this.totalTicketFavor).toDP(2, 1).toNumber();
        return currentValue;
      }, this.ticketRowDevolucion[0]);


      const totalSale = new Decimal(this.totalSale);
      const totalTicketFavor = new Decimal(this.totalTicketFavor);
      let totalTikcetFavorDiferencia: Decimal;

      if (totalTicketFavor.greaterThanOrEqualTo(totalSale)) {
        totalTikcetFavorDiferencia = totalTicketFavor.minus(totalSale);
        this.totalTicket = 0;
      } else {
        totalTikcetFavorDiferencia = new Decimal(0);
        this.totalTicket = totalSale.minus(this.totalTicketFavor).toNumber();
      }

      this.totalTicketFavorDiferencia = totalTikcetFavorDiferencia.toNumber();

      this.cabeceraVenta.setImportesDevolucion(this.ticketRowDevolucion.map(x => x.lineaTicket));
      this.cabeceraVenta.devolucionSaldoAFavor = totalTikcetFavorDiferencia.toNumber();


      if (totalTikcetFavorDiferencia.greaterThan(0)) {
        this.cabeceraVenta.importeVentaNetoOriginal = new Decimal(this.totalTicketOriginal).plus(this.totalSale).toNumber();
      } else if (totalTikcetFavorDiferencia.equals(0)) {

        if (totalTicketFavor.minus(totalSale).lessThan(0)) {
          this.cabeceraVenta.importeVentaNetoOriginal = new Decimal(this.totalSale).plus(totalTicketFavor.minus(totalSale)).toNumber();
        } else {
          this.cabeceraVenta.importeVentaNetoOriginal = this.totalSale;
        }


      }

      this.cabeceraVenta.importeDevolucionTotal = this.totalTicket;

    }

    //OCG: console.log('Fin a calculateTotal');

  }

  setShowSkuField() {
    this.showSkuField = this.tipoItems === TiposProductos.prenda || this.tipoItems === TiposProductos.tarjetaRegalo;
  }

  setShowTotalPrendas() {
    this.showTotalPrendas = !!this.ticketRow.find(value => value.tipoProducto === TiposProductos.prenda);
  }

  updatePriceOnSelectedRow(newPrice: number) {
    this.ticketRow[this.currentSelection].updatePrice(newPrice);
    this.calculateTotal();
  }

  findBySku(sku: number): TicketRow {
    return this.ticketRow.find(item => item.sku === sku);
  }

  findSkuValidatePriceChange(sku: number): boolean {
    const itemChanged = this.ticketRow.find(item => item.sku === sku && item.priceChanged);
    return !!itemChanged;
  }

  findSkuValidateDiscountApplied(sku: number): boolean {
    const itemChanged = this.ticketRow.find(item => item.sku === sku && (item.discountAdded || item.discountTxAdded));
    return !!itemChanged;
  }

  findTarjetaRegalo(folioTarjeta: number): boolean {
    return !!this.ticketRow.find(item =>
      item.lineaTicket.articulo.informacionTarjetaRegalo.folioTarjeta === folioTarjeta
    );
  }

  getSelectedTicketRowDevolucion(rowIndex?: number): TicketRow {

    const index = isNumber(rowIndex) ? rowIndex : this.currentSelectionDevolucion;

    if (isNumber(index)) {
      return this.ticketRowDevolucion[index];
    }
    return null;
  }


  getSelectedTicketRow(rowIndex?: number): TicketRow {

    const index = isNumber(rowIndex) ? rowIndex : this.currentSelection;

    try {

      if (isNumber(index)) {
        return this.ticketRow[index];
      }
      return null;


    } catch (e) {
      //console.log('Error => TicketVirtual.ts => getSelectedTicketRow =>');
      //console.log('rowIndex => ', rowIndex);
      //console.log('this.currentSelection => ', this.currentSelection);
      //console.log('index => ', index);
    }
  }

  applyDiscountToItem(descuent: Descuento) {
    const index = isNumber(descuent.rowIndex) ? descuent.rowIndex : this.currentSelection;

    this.ticketRow[index].applyDiscount(descuent);
    this.calculateTotal();
  }

  //OCG: Función que aplica el descuento
  applyDiscountTxToItem(descuent: Descuento) {
    const index = isNumber(descuent.rowIndex) ? descuent.rowIndex : this.currentSelection;
    //console.log(`Index: ${index}`);
    this.ticketRow[index].applyDiscountTx(descuent);
    this.calculateTotal();
  }

  getLineasDigitoVerificador(): Array<LineaTicketModel> {
    return this.ticketRow.filter(ticketRow =>
      ticketRow.lineaTicket.articulo.digitoVerificadorArticulo && ticketRow.lineaTicket.articulo.digitoVerificadorArticulo.inconsistencia
    ).map(x => x.lineaTicket.getLineaTicket());
  }

  getAllLineaTicket(): Array<LineaTicket> {
    return this.ticketRow.map(x => x.lineaTicket);
  }


  getAllLineaTicketDevolucion(): Array<LineaTicket> {
    return this.ticketRowDevolucion.map(x => x.lineaTicket);
  }

  getRowsDiscountTransaction(): Array<TicketRow> {
    return this.discountTxTicketRow = this.ticketRow.slice(0, this.currentSelection + 1).filter(ticketRow =>
      ticketRow.tipoProducto !== TiposProductos.tarjetaRegalo && !ticketRow.priceChanged && !ticketRow.discountAdded
    );
  }

  getPromocionesPosiblesLinea(): Array<TicketRow> {
    return this.ticketRow.filter(ticketRow => ticketRow.lineaTicket.descuentosPromocionalesPosiblesLinea && ticketRow.lineaTicket.descuentosPromocionalesPosiblesLinea.length);
  }

  removePromocionesFromTicketRow() {
    this.ticketRow.forEach(ticketRow => {
      ticketRow.removePromocionesFromLinea();
      ticketRow.updateGrandTotal();
    });
  }

  applyDevolucion(productResponse: ProductsResponse): boolean {

    const ticketRow = this.ticketRowDevolucion.find(ticketDev => ticketDev.lineaTicket.articulo.sku === productResponse.articulo.sku);

    if (!ticketRow) {
      return false;
    } else {
      ticketRow.articuloComponentInstance.removeOneProduct();
      return true;
    }
  }

}

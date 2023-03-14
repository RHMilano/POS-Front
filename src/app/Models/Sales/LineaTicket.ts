import { LineaTicketModel, LineaTicketModelDecimal } from './LineaTicket.model';
import { DescuentoDirectoLineaModel } from './DescuentoDirectoLinea.model';
import { DescuentoPromocionalLineaModel } from './DescuentoPromocionalLinea.model';
import { CabeceraVentaRequest } from './CabeceraVentaRequest';
import { TipoDetalleVenta } from '../../shared/GLOBAL';
import { Articulo } from '../../layout/ticket-virtual/articulo/Articulo';
import { Decimal } from 'decimal.js/decimal';


export class LineaTicket implements LineaTicketModelDecimal {
  constructor(params: LineaTicketModel = {} as LineaTicketModel, initCalculos?: boolean) {
    const {
      secuencia = 1,
      articulo = new Articulo(),
      cantidadVendida = 1,
      cantidadDevuelta = 0,
      descuentoDirectoLinea = null,
      descuentosPromocionalesPosiblesLinea = [],
      descuentosPromocionalesAplicadosLinea = [],
      importeVentaLineaDescuentos = 0,
      importeDevolucionLineaDescuentos = 0,
      importeVentaLineaBruto = 0,
      importeDevolucionLineaBruto = 0,
      importeVentaLineaImpuestos1 = 0,
      importeVentaLineaImpuestos2 = 0,
      importeDevolucionLineaImpuestos = 0,
      importeVentaLineaNeto = 0,
      importeDevolucionLineaNeto = 0,
      cabeceraVentaAsociada = null,
      codigoTipoDetalleVenta = TipoDetalleVenta.agregarLineaTicket,
      perteneceVentaOriginal = false
    } = params;

    this._secuencia = secuencia;
    this._articulo = new Articulo(articulo);
    this._cantidadVendida = cantidadVendida;
    this._cantidadDevuelta = cantidadDevuelta;
    this._descuentoDirectoLinea = descuentoDirectoLinea;
    this._descuentosPromocionalesPosiblesLinea = descuentosPromocionalesPosiblesLinea;
    this._descuentosPromocionalesAplicadosLinea = descuentosPromocionalesAplicadosLinea;
    this._importeVentaLineaDescuentos = new Decimal(importeVentaLineaDescuentos);
    this._importeDevolucionLineaDescuentos = new Decimal(importeDevolucionLineaDescuentos);
    this._importeVentaLineaBruto = new Decimal(importeVentaLineaBruto);
    this._importeDevolucionLineaBruto = new Decimal(importeDevolucionLineaBruto);
    this._importeVentaLineaImpuestos1 = new Decimal(importeVentaLineaImpuestos1);
    this._importeVentaLineaImpuestos2 = new Decimal(importeVentaLineaImpuestos2);
    this._importeDevolucionLineaImpuestos = new Decimal(importeDevolucionLineaImpuestos);
    this._importeVentaLineaNeto = new Decimal(importeVentaLineaNeto);
    this._importeDevolucionLineaNeto = new Decimal(importeDevolucionLineaNeto);
    this._cabeceraVentaAsociada = cabeceraVentaAsociada;
    this._codigoTipoDetalleVenta = codigoTipoDetalleVenta;
    this._perteneceVentaOriginal = perteneceVentaOriginal;


    if (initCalculos) {
      this._importeVentaLineaBruto = new Decimal(this._articulo.precioConImpuestos).toDP(2, 1).times(this._cantidadVendida);
      this._importeVentaLineaImpuestos1 = new Decimal(this._articulo.impuesto1).toDP(2, 1).times(this._cantidadVendida);
      this._importeVentaLineaNeto = new Decimal(this._articulo.precioConImpuestos).toDP(2, 1).times(this._cantidadVendida);
    }
  }

  private _perteneceVentaOriginal: boolean;


  get perteneceVentaOriginal(): boolean {
    return this._perteneceVentaOriginal;
  }

  set perteneceVentaOriginal(value: boolean) {
    this._perteneceVentaOriginal = value;
  }

  private _descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalLineaModel>;

  get descuentosPromocionalesAplicadosLinea(): Array<DescuentoPromocionalLineaModel> {
    return this._descuentosPromocionalesAplicadosLinea;
  }

  set descuentosPromocionalesAplicadosLinea(value: Array<DescuentoPromocionalLineaModel>) {
    this._descuentosPromocionalesAplicadosLinea = value;
  }

  private _descuentosPromocionalesPosiblesLinea: Array<DescuentoPromocionalLineaModel>;

  get descuentosPromocionalesPosiblesLinea(): Array<DescuentoPromocionalLineaModel> {
    return this._descuentosPromocionalesPosiblesLinea;
  }

  set descuentosPromocionalesPosiblesLinea(value: Array<DescuentoPromocionalLineaModel>) {
    this._descuentosPromocionalesPosiblesLinea = value;
  }

  private _cabeceraVentaAsociada: CabeceraVentaRequest;

  get cabeceraVentaAsociada(): CabeceraVentaRequest {
    return this._cabeceraVentaAsociada;
  }

  set cabeceraVentaAsociada(value: CabeceraVentaRequest) {
    this._cabeceraVentaAsociada = value;
  }

  private _codigoTipoDetalleVenta: TipoDetalleVenta;

  get codigoTipoDetalleVenta(): TipoDetalleVenta {
    return this._codigoTipoDetalleVenta;
  }

  set codigoTipoDetalleVenta(value: TipoDetalleVenta) {
    this._codigoTipoDetalleVenta = value;
  }

  private _importeVentaLineaDescuentos?: Decimal;

  get importeVentaLineaDescuentos(): Decimal {
    return this._importeVentaLineaDescuentos.toDP(2, 1);
  }

  private _importeDevolucionLineaDescuentos?: Decimal;

  get importeDevolucionLineaDescuentos(): Decimal {
    return this._importeDevolucionLineaDescuentos.toDP(2, 1);
  }

  private _importeVentaLineaBruto?: Decimal;

  get importeVentaLineaBruto(): Decimal {
    return this._importeVentaLineaBruto.toDP(2, 1);
  }

  private _importeDevolucionLineaBruto?: Decimal;

  get importeDevolucionLineaBruto(): Decimal {
    return this._importeDevolucionLineaBruto.toDP(2, 1);
  }

  private _importeVentaLineaImpuestos1?: Decimal;

  get importeVentaLineaImpuestos1(): Decimal {
    return this._importeVentaLineaImpuestos1.toDP(2, 1);
  }

  private _importeVentaLineaImpuestos2?: Decimal;

  get importeVentaLineaImpuestos2(): Decimal {
    return this._importeVentaLineaImpuestos2.toDP(2, 1);
  }

  private _importeDevolucionLineaImpuestos?: Decimal;

  get importeDevolucionLineaImpuestos(): Decimal {
    return this._importeDevolucionLineaImpuestos.toDP(2, 1);
  }

  private _importeVentaLineaNeto?: Decimal;

  get importeVentaLineaNeto(): Decimal {
    return this._importeVentaLineaNeto.toDP(2, 1);
  }

  private _importeDevolucionLineaNeto?: Decimal;

  get importeDevolucionLineaNeto(): Decimal {
    return this._importeDevolucionLineaNeto.toDP(2, 1);
  }

  private _descuentoDirectoLinea?: DescuentoDirectoLineaModel;

  get descuentoDirectoLinea(): DescuentoDirectoLineaModel {
    return this._descuentoDirectoLinea;
  }

  set descuentoDirectoLinea(value: DescuentoDirectoLineaModel) {
    this._descuentoDirectoLinea = value;
  }

  private _secuencia?: number;

  get secuencia(): number {
    return this._secuencia;
  }

  set secuencia(value: number) {
    this._secuencia = value;
  }

  private _articulo?: Articulo;

  get articulo(): Articulo {
    return this._articulo;
  }

  private _cantidadVendida?: number;

  get cantidadVendida(): number {
    return this._cantidadVendida;
  }

  set cantidadVendida(value: number) {
    this._cantidadVendida = value;
  }

  private _cantidadDevuelta?: number;

  get cantidadDevuelta(): number {
    return this._cantidadDevuelta;
  }

  set cantidadDevuelta(value: number) {
    this._cantidadDevuelta = value;
  }

  addCantidadVendida() {
    this._cantidadVendida++;
  }

  removeCantidadVendida() {
    this._cantidadVendida--;
  }

  getLineaTotal(): Decimal {
    return this._articulo.getPrecioConImpuestos().times(this._cantidadVendida).toDP(2, 1);
  }

  getGrandTotal(): Decimal {
    if (this._descuentoDirectoLinea && this._descuentoDirectoLinea.codigoRazonDescuento !== 0 && !!this._descuentoDirectoLinea.descripcionRazonDescuento) {
      return this._articulo.getPrecioConImpuestos().times(this._cantidadVendida).toDP(2, 1).minus(this._descuentoDirectoLinea.importeDescuento);
    } else if (this._descuentosPromocionalesAplicadosLinea.length) {

      let ventaTotal = this._articulo.getPrecioConImpuestos().times(this._cantidadVendida).toDP(2, 1);

      this._descuentosPromocionalesAplicadosLinea.forEach(descuentoPromocional => ventaTotal = ventaTotal.minus(Decimal.abs(descuentoPromocional.importeDescuento)));

      return ventaTotal;
    } else {
      return this._articulo.getPrecioConImpuestos().times(this._cantidadVendida).toDP(2, 1);
    }
  }

  getTotalFavor(): Decimal {
    return new Decimal(this.cantidadDevuelta).times(this.articulo.getPrecioConImpuestos()).toDP(2, 1);
  }

  updatePrice(newPrice: number) {
    this._articulo.updatePrice(newPrice);
  }

  getLineaTicket(): LineaTicketModel {

    if (this._descuentoDirectoLinea && this._descuentoDirectoLinea.codigoRazonDescuento) {

      this._importeVentaLineaDescuentos = new Decimal(this._descuentoDirectoLinea.importeDescuento);

      const precioConDescuentoNeto = this._articulo.getPrecioConImpuestos().times(this._cantidadVendida).minus(this._descuentoDirectoLinea.importeDescuento);
      const precioConDescuentoBruto = precioConDescuentoNeto.dividedBy(new Decimal(this._articulo.tasaImpuesto1).dividedBy(100).plus(1)).toDP(2, 1);
      const descuentoImpuestos = precioConDescuentoNeto.minus(precioConDescuentoNeto.dividedBy(new Decimal(this._articulo.tasaImpuesto1).dividedBy(100).plus(1)).toDP(2, 1));

      this._importeVentaLineaBruto = precioConDescuentoBruto;
      this._importeVentaLineaImpuestos1 = descuentoImpuestos;
      this._importeVentaLineaNeto = precioConDescuentoNeto;

    } else if (this._descuentosPromocionalesAplicadosLinea.length) {

      let precioConDescuentoNeto = this._articulo.getPrecioConImpuestos().times(this._cantidadVendida);

      this._importeVentaLineaDescuentos = new Decimal(0);

      this._descuentosPromocionalesAplicadosLinea.forEach(descuentoPromocional => {
        const descuentoImporte = Decimal.abs(descuentoPromocional.importeDescuento).toNumber();
        this._importeVentaLineaDescuentos = this._importeVentaLineaDescuentos.plus(descuentoImporte);
        precioConDescuentoNeto = precioConDescuentoNeto.minus(descuentoImporte);
      });

      const precioConDescuentoBruto = precioConDescuentoNeto.dividedBy(new Decimal(this._articulo.tasaImpuesto1).dividedBy(100).plus(1)).toDP(2, 1);
      const descuentoImpuestos = precioConDescuentoNeto.minus(precioConDescuentoNeto.dividedBy(new Decimal(this._articulo.tasaImpuesto1).dividedBy(100).plus(1)).toDP(2, 1));

      this._importeVentaLineaBruto = precioConDescuentoBruto;
      this._importeVentaLineaImpuestos1 = descuentoImpuestos;
      this._importeVentaLineaNeto = precioConDescuentoNeto;

    } else {

      this._importeVentaLineaDescuentos = new Decimal(0);

      this._importeVentaLineaBruto = this._articulo.getPrecioBruto1().times(this._cantidadVendida);
      this._importeVentaLineaImpuestos1 = this._articulo.getImpuesto1().times(this._cantidadVendida);
      this._importeVentaLineaNeto = this._articulo.getPrecioConImpuestos().times(this._cantidadVendida);

    }

    if (this._cantidadDevuelta > 0) {
      this._importeDevolucionLineaBruto = this._articulo.getPrecioBruto1().times(this._cantidadDevuelta);
      this._importeDevolucionLineaImpuestos = this._articulo.getImpuesto1().times(this._cantidadDevuelta);
      this._importeDevolucionLineaNeto = this._articulo.getPrecioConImpuestos().times(this._cantidadDevuelta);

      if (this._descuentoDirectoLinea && this._descuentoDirectoLinea.codigoRazonDescuento) {
        this._importeDevolucionLineaDescuentos = new Decimal(this._descuentoDirectoLinea.importeDescuento).times(this._cantidadDevuelta);
      }
    }

    //debugger;
    return {
      secuencia: this._secuencia,
      articulo: this._articulo.getArticulo(),
      cantidadVendida: this._cantidadVendida,
      importeVentaLineaNeto: this._importeVentaLineaNeto.toNumber(),
      importeVentaLineaImpuestos1: this._importeVentaLineaImpuestos1.toNumber(),
      importeVentaLineaBruto: this._importeVentaLineaBruto.toNumber(),
      cantidadDevuelta: this._cantidadDevuelta,
      importeDevolucionLineaNeto: this._importeDevolucionLineaNeto.toNumber(),
      importeVentaLineaImpuestos2: this._importeVentaLineaImpuestos2.toNumber(),
      importeDevolucionLineaBruto: this._importeDevolucionLineaBruto.toNumber(),
      descuentoDirectoLinea: this._descuentoDirectoLinea,
      importeDevolucionLineaDescuentos: this._importeDevolucionLineaDescuentos.toNumber(),
      importeDevolucionLineaImpuestos: this._importeDevolucionLineaImpuestos.toNumber(),
      importeVentaLineaDescuentos: this._importeVentaLineaDescuentos.toNumber(),
      codigoTipoDetalleVenta: this._codigoTipoDetalleVenta,
      cabeceraVentaAsociada: this._cabeceraVentaAsociada,
      descuentosPromocionalesAplicadosLinea: this._descuentosPromocionalesAplicadosLinea,
      descuentosPromocionalesPosiblesLinea: this._descuentosPromocionalesPosiblesLinea,
      perteneceVentaOriginal: this._perteneceVentaOriginal
    };
  }

}

export class LineaTicketDevolucion extends LineaTicket {
  private _cantidadVendidaOriginal: number;
  private _cantidadDevueltaOriginal: number;


  constructor(lineaTicket: LineaTicketModel, initCalculos?: boolean) {
    super(lineaTicket, initCalculos);

    this._cantidadVendidaOriginal = this.cantidadVendida;
    this._cantidadDevueltaOriginal = this.cantidadDevuelta;
  }

  addCantidadVendida() {

    this.cantidadVendida++;

  }

  removeCantidadVendida() {

    this.cantidadVendida--;
    this.cantidadDevuelta++;

  }

}

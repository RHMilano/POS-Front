import { DescuentoDirectoLineaModel } from './DescuentoDirectoLinea.model';

export class Descuento implements DescuentoDirectoLineaModel {
  porcentajeDescuento: number;
  importeDescuento: number;
  codigoRazonDescuento: number;
  tipoDescuento: string;
  precioFinal: number;
  descripcionRazonDescuento: string;
  uLSession: string;
  rowIndex: number;
  sku: number;


  constructor(params: DescuentoDirectoLineaModel = {} as DescuentoDirectoLineaModel) {
    const {
      porcentajeDescuento = 0,
      importeDescuento = 0,
      codigoRazonDescuento = 0,
      tipoDescuento = '',
      precioFinal = 0,
      descripcionRazonDescuento = '',
      rowIndex = null,
      uLSession = '',
      sku = 0
    } = params;

    this.importeDescuento = importeDescuento;
    this.porcentajeDescuento = porcentajeDescuento;
    this.codigoRazonDescuento = codigoRazonDescuento;
    this.tipoDescuento = tipoDescuento;
    this.precioFinal = precioFinal;
    this.descripcionRazonDescuento = descripcionRazonDescuento;
    this.rowIndex = rowIndex;
    this.uLSession = uLSession;
    this.sku = sku;
  }

  getDescuento(): DescuentoDirectoLineaModel {
    return {
      tipoDescuento: this.tipoDescuento,
      codigoRazonDescuento: this.codigoRazonDescuento,
      importeDescuento: this.importeDescuento,
      porcentajeDescuento: this.porcentajeDescuento,
      uLSession: this.uLSession
    };
  }
}

export class DescuentoRequest {
  rowIndex: number;
  sku: number;
  itemPrice: number;


  constructor(params: {
    rowIndex: number;
    sku: number;
    itemPrice: number;
  } = {rowIndex: 0, sku: 0, itemPrice: 0}) {

    this.itemPrice = params.itemPrice;
    this.rowIndex = params.rowIndex;
    this.sku = params.sku;

  }

}

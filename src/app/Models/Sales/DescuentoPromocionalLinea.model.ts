
export interface DescuentoPromocionalLineaModel {
  secuencia: number;
  idDescuento: number;
  importeDescuento: number;
  codigoPromocionAplicado: number;
  descripcionCodigoPromocionAplicado: string;
  codigoPromocionOrden: number;
  descuentosPromocionalesFormaPago: Array<DescuentoPromocionalFormaPago>;
  porcentajeDescuento: number;
  codigoRazonDescuento: number;
}

export interface DescuentoPromocionalLineaModelLight {
  secuencia: number;
  idDescuento: number;
  importeDescuento: number;
  codigoPromocionAplicado: number;
  descripcionCodigoPromocionAplicado: string;
  codigoPromocionOrden: number;
  descuentosPromocionalesFormaPago: Array<DescuentoPromocionalFormaPagoLight>;
  porcentajeDescuento: number;
  codigoRazonDescuento: number;
}

export class DescuentoPromocionalFormaPago {
  codigoFormaPago: string;
}

export class DescuentoPromocionalFormaPagoLight {
  codigoFormaPago: string;
}

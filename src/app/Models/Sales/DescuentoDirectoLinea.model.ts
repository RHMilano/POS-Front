export interface DescuentoDirectoLineaModel {
  porcentajeDescuento: number;
  importeDescuento: number;
  codigoRazonDescuento: number;
  tipoDescuento: string;
  descripcionRazonDescuento?: string;
  uLSession?: string;
  precioFinal?: number;
  getDescuento?: () => DescuentoDirectoLineaModel;
  rowIndex?: number;
  sku?: number;
}

export interface DescuentoDirectoLineaModelLight {
  porcentajeDescuento: number;
  importeDescuento: number;
  codigoRazonDescuento: number;
  tipoDescuento: string;
  descripcionRazonDescuento?: string;
  uLSession?: string;
  precioFinal?: number;
  getDescuento?: () => DescuentoDirectoLineaModelLight;
  rowIndex?: number;
  sku?: number;
}

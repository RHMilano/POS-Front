import { DescuentoPromocionalAplicadoModel } from './DescuentoPromocionalAplicadoModel';


export class DescuentoPromocionalAplicado implements DescuentoPromocionalAplicadoModel {
  secuencia: number;
  importeDescuento: number;
  codigoPromocionAplicado: number;
  descripcionCodigoPromocionAplicado: string;
  formaPagoCodigoPromocionAplicado: string;
  codigoRazonDescuento: number;
  porcentajeDescuento: number;


  constructor(request: DescuentoPromocionalAplicadoModel = {} as DescuentoPromocionalAplicadoModel) {
    const {
      secuencia = 0,
      importeDescuento = 0,
      codigoPromocionAplicado = 0,
      descripcionCodigoPromocionAplicado = '',
      formaPagoCodigoPromocionAplicado = '',
      codigoRazonDescuento = 0,
      porcentajeDescuento = 0
    } = request;

    this.secuencia = secuencia;
    this.importeDescuento = importeDescuento;
    this.codigoPromocionAplicado = codigoPromocionAplicado;
    this.descripcionCodigoPromocionAplicado = descripcionCodigoPromocionAplicado;
    this.formaPagoCodigoPromocionAplicado = formaPagoCodigoPromocionAplicado;
    this.porcentajeDescuento = porcentajeDescuento;
    this.codigoRazonDescuento = codigoRazonDescuento;
  }
}

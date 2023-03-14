import { DescuentoPromocionalFormaPago } from '../Sales/DescuentoPromocionalLinea.model';
import {TipoPago} from '../../shared/GLOBAL';

export interface DescuentoPromocionalVentaModel {
  idDescuento: number;
  secuencia: number;
  importeDescuento: number;
  codigoPromocionAplicado: number;
  codigoPromocionOrden: number;
  descripcionCodigoPromocionAplicado: string;
  descuentosPromocionalesFormaPago: Array<DescuentoPromocionalFormaPago>;
  formaPagoCodigoPromocionAplicado?: TipoPago;
  porcentajeDescuento: number;
  codigoRazonDescuento: number;
}

import {ClasificacionVenta, TipoPago} from '../../shared/GLOBAL';

export interface VentaTarjetaRequestModel {
  mesesFinanciamiento: number;
  mesesParcialidades: number;
  codigoPromocion: number;
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: TipoPago;
  importeVentaTotal: number;
  estatus: string;
  secuenciaFormaPagoImporte: number;
  clasificacionVenta: ClasificacionVenta;
}

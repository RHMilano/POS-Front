import {ClasificacionVenta, TipoPago} from '../../shared/GLOBAL';

export interface PuntosTarjetaRequestModel {
  pagarConPuntos: boolean;
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: TipoPago;
  importeVentaTotal: number;
  estatus: string;
  secuenciaFormaPagoImporte: number;
  clasificacionVenta: ClasificacionVenta;
}

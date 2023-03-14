import {ClasificacionVenta, TipoPago} from '../../shared/GLOBAL';

export interface RetiroTarjetaRequestModel {
  retirar: boolean;
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: TipoPago;
  importeCashBack: number;
  estatus: string;
  secuenciaFormaPagoImporte: number;
  clasificacionVenta: ClasificacionVenta;
}

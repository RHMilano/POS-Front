import {ClasificacionVenta} from '../../shared/GLOBAL';

export class MovimientoTarjetaRegaloRequest {
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: string;
  importeVentaTotal: number;
  folioTarjeta: number;
  secuenciaFormaPagoImporte: number;
  estatus: string;
  clasificacionVenta: ClasificacionVenta;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;
}

export class MovimientoTarjetaRegaloResponse {
  codeNumber: string;
  codeDescription: string;
}

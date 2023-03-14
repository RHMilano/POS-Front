import {ClasificacionVenta} from '../../shared/GLOBAL';

export class MovimientoNotaCreditoRequest {
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: string;
  importeVentaTotal: number;
  folioNotaCredito: string;
  secuenciaFormaPagoImporte: number;
  estatus: string;
  clasificacionVenta: ClasificacionVenta;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;
}

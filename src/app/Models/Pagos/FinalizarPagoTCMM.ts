import {ClasificacionVenta, TipoPago} from '../../shared/GLOBAL';

export class FinalizarPagoTCMM {
  numeroTarjeta: string;
  planFinanciamiento: string;
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: TipoPago;
  importeVentaTotal: number;
  estatus: string;
  secuenciaFormaPagoImporte: number;
  clasificacionVenta: ClasificacionVenta;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;
  mesesFinanciados: number; // OCG: Número de meses financiados

}

import {EstadosPago, TipoPago} from '../../shared/GLOBAL';

export class RedencionCuponesRequest {
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: TipoPago;
  importeVentaTotal: number;
  estatus: EstadosPago;
  secuenciaFormaPagoImporte: number;
  folioCuponPromocional: string;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;

}

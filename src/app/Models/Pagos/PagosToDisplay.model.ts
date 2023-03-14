import { PagosOps, TipoPago } from '../../shared/GLOBAL';
import { FormaPagoUtilizadoModel } from './FormaPagoUtilizado.model';

export interface PagosToDisplayModel {
  orden?: number;
  nombre?: string;
  nombreCompuesto?: string;
  numeroTarjeta?: string;
  cantidad?: number;
  clave?: TipoPago;
  anulable?: boolean;
  formaDePago?: FormaPagoUtilizadoModel;
  cantidadMonedaExtranjera?: number;
  PagosOps?: PagosOps;
}

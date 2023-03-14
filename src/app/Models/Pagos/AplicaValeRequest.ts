import {EstadosPago, TipoPago} from '../../shared/GLOBAL';

export class AplicaValeRequest {
  folioOperacionAsociada: string;
  codigoFormaPagoImporte:TipoPago;
  importeVentaTotal: number;
  estatus: EstadosPago;
  secuenciaFormaPagoImporte: number;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;
  folioVale: string
  idDistribuidora: number;
  montoVale: number;
  quincenas: number;
  tipoPago: string;
  fechaNacimiento: string;
  INE: string;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  calle: string;
  numExt: string;
  colonia: string;
  estado: string;
  municipio: string;
  cP: string;
  sexo: string;
  puntosUtilizados: number;
  efectivoPuntos: number;
}

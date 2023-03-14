import {PuntosTarjetaRequestModel} from './PuntosTarjetaRequest.model';
import {ClasificacionVenta, TipoPago} from '../../shared/GLOBAL';

export class PuntosTarjetaRequest implements PuntosTarjetaRequestModel {
  pagarConPuntos: boolean;
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: TipoPago;
  importeVentaTotal: number;
  estatus: string;
  secuenciaFormaPagoImporte: number;
  clasificacionVenta: ClasificacionVenta;

  constructor(request: PuntosTarjetaRequestModel = {} as PuntosTarjetaRequestModel) {
    const {
      pagarConPuntos = false,
      folioOperacionAsociada = '0',
      codigoFormaPagoImporte = TipoPago.tarjetaVisa,
      importeVentaTotal = 0,
      estatus = '',
      secuenciaFormaPagoImporte = 0,
      clasificacionVenta = ClasificacionVenta.regular

    } = request;

    this.pagarConPuntos = pagarConPuntos;
    this.folioOperacionAsociada = folioOperacionAsociada;
    this.codigoFormaPagoImporte = codigoFormaPagoImporte;
    this.importeVentaTotal = importeVentaTotal;
    this.estatus = estatus;
    this.secuenciaFormaPagoImporte = secuenciaFormaPagoImporte;
    this.clasificacionVenta = clasificacionVenta;
  }
}

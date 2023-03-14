import {VentaTarjetaRequestModel} from './VentaTarjetaRequest.model';
import {ClasificacionVenta, TipoPago} from '../../shared/GLOBAL';

export class VentaTarjetaRequest implements VentaTarjetaRequestModel {
  mesesFinanciamiento: number;
  mesesParcialidades: number;
  codigoPromocion: number;
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: TipoPago;
  importeVentaTotal: number;
  estatus: string;
  secuenciaFormaPagoImporte: number;
  clasificacionVenta: ClasificacionVenta;

  constructor(request: VentaTarjetaRequestModel = {} as VentaTarjetaRequestModel) {
    const {
      mesesFinanciamiento = 0,
      mesesParcialidades = 0,
      codigoPromocion = 0,
      folioOperacionAsociada = '0',
      codigoFormaPagoImporte = TipoPago.tarjetaVisa,
      estatus = 'PR',
      secuenciaFormaPagoImporte = 0,
      clasificacionVenta = ClasificacionVenta.regular

    } = request;

    this.mesesFinanciamiento = mesesFinanciamiento;
    this.mesesParcialidades = mesesParcialidades;
    this.codigoPromocion = codigoPromocion;
    this.folioOperacionAsociada = folioOperacionAsociada;
    this.codigoFormaPagoImporte = codigoFormaPagoImporte;
    this.estatus = estatus;
    this.secuenciaFormaPagoImporte = secuenciaFormaPagoImporte;
    this.clasificacionVenta = clasificacionVenta;
  }
}

import {ClasificacionVenta, TipoPago} from '../../shared/GLOBAL';
import {RetiroTarjetaRequestModel} from './RetiroTarjetaRequest.model';

export class RetiroTarjetaRequest implements RetiroTarjetaRequestModel {
  retirar: boolean;
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: TipoPago;
  importeCashBack: number;
  estatus: string;
  secuenciaFormaPagoImporte: number;
  clasificacionVenta: ClasificacionVenta;

  constructor(request: RetiroTarjetaRequestModel = {} as RetiroTarjetaRequestModel) {
    const {
      retirar = false,
      folioOperacionAsociada = '0',
      codigoFormaPagoImporte = TipoPago.tarjetaVisa,
      importeCashBack = 0,
      estatus = 'PR',
      secuenciaFormaPagoImporte = 0,
      clasificacionVenta = ClasificacionVenta.regular

    } = request;

    this.retirar = retirar;
    this.folioOperacionAsociada = folioOperacionAsociada;
    this.codigoFormaPagoImporte = codigoFormaPagoImporte;
    this.importeCashBack = importeCashBack;
    this.estatus = estatus;
    this.secuenciaFormaPagoImporte = secuenciaFormaPagoImporte;
    this.clasificacionVenta = clasificacionVenta;
  }
}

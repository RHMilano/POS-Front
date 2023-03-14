import {FormaPagoUtilizado} from '../Pagos/FormaPagoUtilizado';

export class FinalizarPagoTCMMRequest {
  numeroTarjeta: string;
  codigoTipoCabeceraTCMM: string;
  codigoTipoDetalleTCMM: string;
  importePagoNeto: number;
  formasPagoUtilizadas: Array<FormaPagoUtilizado>;
}

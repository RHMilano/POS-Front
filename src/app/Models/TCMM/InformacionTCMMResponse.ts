import {CodigoRespuestaTCMM} from './CodigoRespuestaTCMM';

export class InformacionTCMMResponse {
  equivalenteEnPuntos: number;
  fechaLimitePago: string;
  pagoMinimo: number;
  puntosAcumuladosUltimoCorte: number;
  saldoAlCorte: number;
  saldoEnLinea: number;
  saldoEnPuntos: number;
  montoPagoSinIntereses: number;
  codigoRespuestaTCMM: CodigoRespuestaTCMM;
}

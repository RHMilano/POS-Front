export class ProcesarMovimientoMayoristaRequest {
  codigoMayorista: number;
  codigoClienteFinal: number;
  numeroVale: number;
  importeVentaTotal: number;
  montoFinanciado: number;
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: string;
  importePagoMonedaNacional: number;
  estatus: string;
  secuenciaFormaPagoImporte: number;
  nombreClienteFinal: string;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;
}

export class ProcesarMovimientoMayoristaResponse {
  codeDescription: string;
  codeNumber: number;
}

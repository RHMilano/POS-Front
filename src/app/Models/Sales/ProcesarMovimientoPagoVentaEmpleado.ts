export class ProcesarMovimientoPagoVentaEmpleadoRequest {
  codigoEmpleado: number;
  codigoTienda: number;
  codigoCaja: number;
  importeVentaTotal: number;
  montoFinanciado: number;
  folioOperacionAsociada: string;
  codigoFormaPagoImporte: string;
  importePagoMonedaNacional: number;
  estatus: string;
  secuenciaFormaPagoImporte: number;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;
}

export class ProcesarMovimientoPagoVentaEmpleadoResponse {
  codeDescription: string;
  codeNumber: number;
}

export class BuscarTicketRequest {
  folioOperacion: string;
  fechaInicial: string;
  fechaFinal: string;
}

export class BuscarTicketResponse {
  codigoCaja: number;
  codigoTienda: number;
  fecha: string;
  folioOperacion: string;
}

export class reimpresionResponse {
  codeDescription: string;
  codeNumber: number;
}

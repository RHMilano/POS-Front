import { LineaTicketModel } from './LineaTicket.model';
import { LineaTicket } from './LineaTicket';

export class
CambiarPrecioRequest {
  lineaTicket: LineaTicketModel;
  codigoRazon: number;

  constructor(params: {
    lineaTicket: LineaTicket,
    codigoRazon: number
  }) {

    const {
      lineaTicket = null,
      codigoRazon = 0
    } = params;

    this.codigoRazon = codigoRazon;
    this.lineaTicket = lineaTicket.getLineaTicket();


  }

}

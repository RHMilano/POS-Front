import { DevolverArticuloRequestModel } from './DevolverArticuloRequest.model';
import { LineaTicket } from './LineaTicket';
import { LineaTicketModel, LineaTicketModelDecimal } from './LineaTicket.model';

export class DevolverArticuloRequest implements DevolverArticuloRequestModel {
  codigoRazon: number;
  lineaTicket: LineaTicketModel;

  constructor(params: DevolverArticuloRequestModel = {} as DevolverArticuloRequestModel) {
    const {
      lineaTicket = new LineaTicket().getLineaTicket(),
      codigoRazon = 0
    } = params;

    this.codigoRazon = codigoRazon;
    this.lineaTicket = lineaTicket;

  }

}

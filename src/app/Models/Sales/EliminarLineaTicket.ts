import { EliminarLineaTicketModel } from './EliminarLineaTicket.model';
import { LineaTicketModel } from './LineaTicket.model';

export class EliminarLineaTicket implements EliminarLineaTicketModel {
  lineaTicket: LineaTicketModel;
  secuenciaOriginalLineaTicket: number;
  codigoRazon: number;


  constructor(params: EliminarLineaTicketModel = {} as EliminarLineaTicketModel) {
    const {
      lineaTicket = null,
      secuenciaOriginalLineaTicket = 0,
      codigoRazon = 0
    } = params;

    this.lineaTicket = lineaTicket;
    this.secuenciaOriginalLineaTicket = secuenciaOriginalLineaTicket;
    this.codigoRazon = codigoRazon;
  }
}

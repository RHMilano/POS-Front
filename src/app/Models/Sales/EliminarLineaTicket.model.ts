import { LineaTicketModel } from './LineaTicket.model';

export interface EliminarLineaTicketModel {
  secuenciaOriginalLineaTicket?: number;
  lineaTicket?: LineaTicketModel;
  codigoRazon?: number;
}

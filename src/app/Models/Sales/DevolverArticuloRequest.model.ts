import { LineaTicketModel, LineaTicketModelDecimal } from './LineaTicket.model';

export interface DevolverArticuloRequestModel {
  lineaTicket: LineaTicketModel;
  codigoRazon: number;
}

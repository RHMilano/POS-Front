import {InformacionTCMMRequest} from '../TCMM/InformacionTCMMRequest';

export class PagoTCMM implements InformacionTCMMRequest {
  numeroTarjeta: string;
  imprimirTicket: boolean;
  cantidadPagar: number;
}


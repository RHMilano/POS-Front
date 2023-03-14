import {TipoCabeceraTotalizar} from '../../shared/GLOBAL';

export interface BusquedaTransaccionRequestModel {
  folioOperacion: string;
  fechaInicial: string;
  fechaFinal: string;
  estatus: string;
}

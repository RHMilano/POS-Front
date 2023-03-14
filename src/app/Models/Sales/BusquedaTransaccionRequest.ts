import { BusquedaTransaccionRequestModel } from './BusquedaTransaccionRequest.model';
import {TipoCabeceraTotalizar} from '../../shared/GLOBAL';

export class BusquedaTransaccionRequest implements BusquedaTransaccionRequestModel {
  folioOperacion: string;
  fechaInicial: string;
  fechaFinal: string;
  estatus: string;

  constructor(request: BusquedaTransaccionRequestModel = {} as BusquedaTransaccionRequestModel) {
    const {
      folioOperacion = '0',
      fechaInicial = '',
      fechaFinal = '',
      estatus= ''
    } = request;

    this.folioOperacion = folioOperacion;
    this.fechaInicial = fechaInicial;
    this.fechaFinal = fechaFinal;
    this.estatus = estatus;
  }

}

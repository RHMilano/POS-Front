import {BusquedaTransaccionResponseModel} from './BusquedaTransaccionResponse.model';


export class BusquedaTransaccionResponse implements BusquedaTransaccionResponseModel {
  folioOperacion: string;
  codigoTienda: number;
  codigoCaja: number;
  fecha: Date;

  constructor(request: BusquedaTransaccionResponseModel = {} as BusquedaTransaccionResponseModel){
    const {
      folioOperacion = '0',
      codigoTienda = 0,
      codigoCaja = 0,
      fecha = new Date()

    } = request;

    this.folioOperacion = folioOperacion;
    this.codigoTienda = codigoTienda;
    this.codigoCaja = codigoCaja;
    this.fecha = fecha;
  }
}

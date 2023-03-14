import {BusquedaTransaccionResponseModel} from './BusquedaTransaccionResponse.model';


export interface  BusquedaTransaccionResponseModel {
  folioOperacion: string;
  codigoTienda: number;
  codigoCaja: number;
  fecha: Date;
}

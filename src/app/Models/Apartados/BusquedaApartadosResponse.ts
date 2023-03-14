import {ApartadoResponse} from './ApartadoResponse';
import {ConfigGeneralesCajaTiendaFormaPagoModel} from '../General/ConfigGeneralesCajaTiendaFormaPago.model';

export class BusquedaApartadosResponse {
  Apartados: Array<ApartadoResponse>;
  informacionAsociadaFormasPago: Array<ConfigGeneralesCajaTiendaFormaPagoModel>;
  informacionAsociadaFormasPagoMonedaExtranjera: Array<ConfigGeneralesCajaTiendaFormaPagoModel> ;
}

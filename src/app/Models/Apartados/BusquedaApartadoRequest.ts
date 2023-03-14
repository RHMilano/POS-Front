import {BusquedaApartadoRequestModel} from './BusquedaApartadoRequest.model';

export class BusquedaApartadoRequest {
  folioApartado: string;
  telefono: string;
  nombre: string;

  constructor(request: BusquedaApartadoRequestModel = {} as BusquedaApartadoRequestModel) {
  const {
    folioApartado = '0',
    telefono = '',
    nombre = ''

  } = request;

  this.folioApartado = folioApartado;
  this.telefono = telefono;
  this.nombre = nombre;
  }

}

import { ClienteResponseModel } from './ClienteResponse.model';

export class ClienteModificaRequest implements ClienteResponseModel {


  apellidoMaterno: string;
  apellidoPaterno: string;
  calle: string;
  ciudad: string;
  codigoCliente: number;
  codigoPostal: string;
  codigoTienda: number;
  email: string;
  estado: string;
  noExterior: string;
  noInterior: string;
  nombre: string;
  telefono: string;
  codigoCaja: number;



  constructor(request: ClienteResponseModel = {} as ClienteResponseModel) {
    const {
      apellidoMaterno = '',
      apellidoPaterno = '',
      calle = '',
      ciudad = '',
      codigoCliente = 0,
      codigoPostal = '',
      codigoTienda = 0,
      email = '',
      estado = '',
      noExterior = '',
      noInterior = '',
      nombre = '',
      telefono = '',
      codigoCaja = 0
    } = request;

    this.apellidoMaterno = apellidoMaterno || '';
    this.apellidoPaterno = apellidoPaterno || '';
    this.calle = calle || '';
    this.ciudad = ciudad || '';
    this.codigoCliente = codigoCliente || 0;
    this.codigoPostal = codigoPostal || '';
    this.codigoTienda = codigoTienda || 0;
    this.email = email || '';
    this.estado = estado || '';
    this.noExterior = noExterior || '';
    this.noInterior = noInterior || '';
    this.nombre = nombre || '';
    this.telefono = telefono || '';
    this.codigoCaja = codigoCaja || 0;
  }
}

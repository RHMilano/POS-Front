import { ClienteModel } from './Cliente.model';

export class ClienteRequest implements ClienteModel {

  codigoCliente: number;
  nombre: string;
  telefono: string;

  constructor(request: ClienteModel = {} as ClienteModel) {
    const {
      codigoCliente = 0,
      nombre = '',
      telefono = ''
    } = request;

    this.codigoCliente = codigoCliente || 0;
    this.nombre = nombre || '';
    this.telefono = telefono || '';
  }
}

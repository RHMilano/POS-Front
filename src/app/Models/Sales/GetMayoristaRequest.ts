import { GetMayoristaModel } from './GetMayorista.model';

export class GetMayoristaRequest implements GetMayoristaModel {

  codigoMayorista: number;
  nombre: string;
  soloActivos: string;

  constructor(request: GetMayoristaModel = {} as GetMayoristaModel) {
    const {
      codigoMayorista = 0,
      nombre = '',
      soloActivos = '0'
    } = request;

    this.codigoMayorista = Number(codigoMayorista);
    this.nombre = nombre;
    this.soloActivos = soloActivos;

  }
}

import { AnularApartadoModel } from './AnularApartado.model';

export class AnularApartado implements AnularApartadoModel {
  codigoRazon: number;
  folioApartado: string;

  constructor(params: AnularApartadoModel = {} as AnularApartadoModel) {
    const {
      codigoRazon = 0,
      folioApartado = ''
    } = params;

    this.codigoRazon = codigoRazon;
    this.folioApartado = folioApartado;

  }
}

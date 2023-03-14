import { TotalizarApartadoModel } from './TotalizarApartado.model';
import { CabeceraApartadosRequest } from './CabeceraApartadosRequest';

export class TotalizarApartadoRequest implements TotalizarApartadoModel {

  cabeceraVentaAsociada: CabeceraApartadosRequest;

  constructor(params: TotalizarApartadoModel = {} as TotalizarApartadoModel) {

    const {
      cabeceraVentaAsociada= null
    } = params;

    this.cabeceraVentaAsociada = cabeceraVentaAsociada;

  }

}

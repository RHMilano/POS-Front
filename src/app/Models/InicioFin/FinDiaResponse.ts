import {ResultadoValidacionCaja} from './ResultadoValidacionCaja';


export class FinDiaResponse {
  finDiaPermitido: boolean;
  requiereCapturarLuz: boolean;
  requiereCapturarLuzInicioDia: boolean;
  mensajeAsociado: string;
  resultadosValidacionesCajas : Array<ResultadoValidacionCaja>
}

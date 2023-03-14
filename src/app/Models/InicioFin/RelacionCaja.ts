import {GrupoRelacionCaja} from './GrupoRelacionCaja';
import {DepositoAsociado} from './DepositoAsociado';

export class RelacionCaja {
  idRelacionCaja: number;
  codigoTienda: number;
  totalConIVA: number;
  totalSinIVA: number;
  iVA: number;
  fecha: string;
  totalRegistros: number;
  depositosAsociados: Array<DepositoAsociado>;
  gruposRelacionCaja: Array<GrupoRelacionCaja>
}

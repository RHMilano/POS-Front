import {SeccionRelacionCaja} from './SeccionRelacionCaja';

export class GrupoRelacionCaja {
  idGrupo: number;
  encabezado: string;
  totalConIVA: number;
  totalSinIVA: number;
  iVA: number;
  seccionesRelacionCaja: Array<SeccionRelacionCaja>
}

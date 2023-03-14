import {Desglose} from './Desglose';

export class SeccionRelacionCaja {
  idSeccion: number;
  encabezado: string;
  totalConIVA: number;
  totalSinIVA: number;
  iVA: number;
  desgloseRelacionCaja: Array<Desglose>
}

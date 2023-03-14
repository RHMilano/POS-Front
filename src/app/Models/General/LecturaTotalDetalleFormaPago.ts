import {ConfigGeneralesCajaTiendaFormaPagoModel} from './ConfigGeneralesCajaTiendaFormaPago.model';
import {DenominacionesModel} from '../Pagos/DenominacionesModel';

export class LecturaTotalDetalleFormaPago {
  importeFisico: number;
  importeTeorico: number;
  importeRetiro: number;
  informacionAsociadaFormaPago: ConfigGeneralesCajaTiendaFormaPagoModel;
  informacionAsociadaDenominaciones: Array<DenominacionesModel>;
  totalIngresosConRetirosParciales: number;
  totalIngresosConRetirosParcialesConFondoFijo: number;
  totalFondoFijo: number;
  totalRetirosParciales: number;
}

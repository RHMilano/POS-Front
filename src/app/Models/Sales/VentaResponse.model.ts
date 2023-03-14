import { LineaTicketModel } from './LineaTicket.model';
import { TipoCabeceraTotalizar } from '../../shared/GLOBAL';
import { GetMayoristaMilanoResponseModel } from './GetMayoristaMilanoResponse.model';
import { GetEmployeeMilanoResponseModel } from './GetEmployeeMilanoResponse.model';
import { Employee } from './Employee';
import {OperationResponseModel} from './OperationResponse.model';

export interface VentaResponseModel {
  folioVenta: string;
  codigoTipoCabeceraVenta: TipoCabeceraTotalizar;
  lineasTicket: Array<LineaTicketModel>;
  importeVentaDescuentos: number;
  importeDevolucionBruto: number;
  importeDevolucionImpuestos: number;
  importeDevolucionNeto: number;
  importeVentaBruto: number;
  importeVentaImpuestos: number;
  importeVentaNeto: number;
  importeVentaNetoOriginal: number;
  numeroNominaEmpleado: number;
  codigoEmpleadoVendedor: number;
  codigoMayorista: number;
  estatus: string;
  consecutivoSecuencia: number;
  informacionEmpleadoMilano: GetEmployeeMilanoResponseModel;
  informacionMayorista: GetMayoristaMilanoResponseModel;
  informacionEmpleadoVendedor: Employee;
  folioDevolucion: string;
  folioVentaOriginal: string;
  operationResponse: OperationResponseModel;

}

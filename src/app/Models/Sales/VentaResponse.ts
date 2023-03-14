import { VentaResponseModel } from './VentaResponse.model';
import { LineaTicketModel } from './LineaTicket.model';
import { TipoCabeceraTotalizar } from '../../shared/GLOBAL';
import { GetEmployeeMilanoResponseModel } from './GetEmployeeMilanoResponse.model';
import { GetMayoristaMilanoResponseModel } from './GetMayoristaMilanoResponse.model';
import { Employee } from './Employee';
import {OperationResponseModel} from './OperationResponse.model';

export class VentaResponse implements VentaResponseModel {
  folioVenta: string;
  estatus: string;
  codigoTipoCabeceraVenta: TipoCabeceraTotalizar;
  lineasTicket: Array<LineaTicketModel>;
  importeVentaDescuentos: number;
  importeDevolucionBruto: number;
  importeDevolucionImpuestos: number;
  importeDevolucionNeto: number;
  importeVentaBruto: number;
  importeVentaImpuestos: number;
  importeVentaNeto: number;
  codigoEmpleadoVendedor: number;
  codigoMayorista: number;
  numeroNominaEmpleado: number;
  consecutivoSecuencia: number;
  informacionEmpleadoMilano: GetEmployeeMilanoResponseModel;
  informacionMayorista: GetMayoristaMilanoResponseModel;
  informacionEmpleadoVendedor: Employee;
  folioDevolucion: string;
  folioVentaOriginal: string;
  importeVentaNetoOriginal: number;
  operationResponse: OperationResponseModel;


  constructor(request: VentaResponseModel = {} as VentaResponseModel) {
    const {
      folioVenta = '',
      estatus = '',
      codigoTipoCabeceraVenta = TipoCabeceraTotalizar.ventaRegular,
      lineasTicket = [],
      importeVentaDescuentos = 0,
      importeVentaBruto = 0,
      importeDevolucionImpuestos = 0,
      importeDevolucionNeto = 0,
      importeDevolucionBruto = 0,
      importeVentaImpuestos = 0,
      importeVentaNeto = 0,
      codigoEmpleadoVendedor = 0,
      codigoMayorista = 0,
      numeroNominaEmpleado = 0,
      consecutivoSecuencia = 0,
      informacionEmpleadoMilano = null,
      informacionMayorista = null,
      informacionEmpleadoVendedor = null,
      folioDevolucion = '',
      folioVentaOriginal = '',
      importeVentaNetoOriginal = 0
    } = request;

    this.folioVenta = folioVenta;
    this.estatus = estatus;
    this.codigoTipoCabeceraVenta = codigoTipoCabeceraVenta;
    this.lineasTicket = lineasTicket;
    this.importeVentaDescuentos = importeVentaDescuentos;
    this.importeVentaBruto = importeVentaBruto;
    this.importeDevolucionImpuestos = importeDevolucionImpuestos;
    this.importeDevolucionNeto = importeDevolucionNeto;
    this.importeDevolucionBruto = importeDevolucionBruto;
    this.importeVentaImpuestos = importeVentaImpuestos;
    this.importeVentaNeto = importeVentaNeto;
    this.codigoEmpleadoVendedor = codigoEmpleadoVendedor;
    this.codigoMayorista = codigoMayorista;
    this.numeroNominaEmpleado = numeroNominaEmpleado;
    this.consecutivoSecuencia = consecutivoSecuencia;
    this.informacionEmpleadoMilano = informacionEmpleadoMilano;
    this.informacionMayorista = informacionMayorista;
    this.informacionEmpleadoVendedor = informacionEmpleadoVendedor;
    this.folioDevolucion = folioDevolucion;
    this.folioVentaOriginal = folioVentaOriginal;
    this.importeVentaNetoOriginal = importeVentaNetoOriginal;
  }
}

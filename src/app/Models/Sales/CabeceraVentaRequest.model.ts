import { TipoCabeceraTotalizar } from '../../shared/GLOBAL';

export interface CabeceraVentaRequestModel {
  folioOperacion: string;
  codigoMayorista: number;
  codigoEmpleadoVendedor: number;
  codigoCliente: number;
  numeroNominaVentaEmpleado: number;
  codigoTipoCabeceraVenta: TipoCabeceraTotalizar;
  importeVentaDescuentos: number;
  importeDevolucionBruto: number;
  importeDevolucionTotal: number;
  importeDevolucionImpuestos: number;
  importeDevolucionNeto: number;
  importeVentaBruto: number;
  importeVentaImpuestos: number;
  importeVentaNeto: number;
  importeVentaNetoOriginal: number;
  codigoMayoristaCredito: number;
  nombreMembresia: string;
  folioDevolucion: string;
  folioVentaOriginal: string;
  devolucionSaldoAFavor: number;
  clienteTieneSaldoPendientePagar?: boolean;
}

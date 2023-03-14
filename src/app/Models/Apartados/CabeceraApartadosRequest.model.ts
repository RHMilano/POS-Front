import {TipoCabeceraTotalizar} from '../../shared/GLOBAL';

export interface CabeceraApartadosRequestModel {
  folioOperacion: string;
  codigoEmpleadoVendedor: number;
  importeVentaBruto: number;
  importeVentaImpuestos: number;
  importeVentaNeto: number;
  codigoTipoCabeceraVenta: TipoCabeceraTotalizar;
}

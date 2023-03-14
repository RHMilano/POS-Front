
import { TipoCabeceraTotalizar } from '../../shared/GLOBAL';
import {CabeceraApartadosRequestModel} from './CabeceraApartadosRequest.model';

export class CabeceraApartadosRequest implements CabeceraApartadosRequestModel {
  folioOperacion: string;
  codigoEmpleadoVendedor: number;
  importeVentaBruto: number;
  importeVentaImpuestos: number;
  importeVentaNeto: number;
  codigoTipoCabeceraVenta: TipoCabeceraTotalizar;

  constructor(request: CabeceraApartadosRequestModel = {} as CabeceraApartadosRequestModel) {
    const {
      folioOperacion = '',
      codigoEmpleadoVendedor = 0,
      importeVentaBruto = 0,
      importeVentaImpuestos = 0,
      importeVentaNeto = 0,
      codigoTipoCabeceraVenta = TipoCabeceraTotalizar.apartado
    } = request;

    this.folioOperacion = folioOperacion;
    this.codigoEmpleadoVendedor = codigoEmpleadoVendedor;
    this.importeVentaBruto = importeVentaBruto;
    this.importeVentaImpuestos = importeVentaImpuestos;
    this.importeVentaNeto = importeVentaNeto;
    this.codigoTipoCabeceraVenta = codigoTipoCabeceraVenta;
  }
}

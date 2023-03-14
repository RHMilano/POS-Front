import {FormaPagoUtilizadoModel} from './FormaPagoUtilizado.model';
import {InformacionTipoCambio} from '../General/InformacionTipoCambio';
import {EstadosPago, TipoPago} from '../../shared/GLOBAL';
import {DescuentoPromocionalAplicado} from '../Sales/DescuentoPromocionalAplicado';


export class FormaPagoUtilizado implements FormaPagoUtilizadoModel {
  importeMonedaNacional: number;
  importeCambioMonedaNacional: number;
  importeCambioExcedenteMonedaNacional: number;
  codigoFormaPagoImporte: TipoPago;
  codigoFormaPagoImporteCambio: TipoPago;
  codigoTipoTransaccionImporteCambioExcedente: string;
  informacionTipoCambio: InformacionTipoCambio;
  secuenciaFormaPagoImporte: number;
  secuenciaFormaPagoImporteCambio: number;
  secuenciaFormaPagoImporteCambioExcedente: number;
  estatus: EstadosPago;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;


  constructor(request: FormaPagoUtilizadoModel = {} as FormaPagoUtilizadoModel) {
    const {
      importeMonedaNacional = 0,
      importeCambioMonedaNacional = 0,
      importeCambioExcedenteMonedaNacional = 0,
      codigoFormaPagoImporte = TipoPago.efectivo,
      codigoFormaPagoImporteCambio = TipoPago.cambio,
      codigoTipoTransaccionImporteCambioExcedente = '0I',
      secuenciaFormaPagoImporte = 0,
      secuenciaFormaPagoImporteCambio = 0,
      secuenciaFormaPagoImporteCambioExcedente = 0,
      informacionTipoCambio = new InformacionTipoCambio(),
      estatus = EstadosPago.Pendiente,
      descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] },
      descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] }
    } = request;

    this.importeMonedaNacional = importeCambioMonedaNacional;
    this.importeCambioMonedaNacional = importeCambioMonedaNacional;
    this.importeCambioExcedenteMonedaNacional = importeCambioExcedenteMonedaNacional;
    this.codigoFormaPagoImporte = codigoFormaPagoImporte;
    this.codigoFormaPagoImporteCambio = codigoFormaPagoImporteCambio;
    this.codigoTipoTransaccionImporteCambioExcedente = codigoTipoTransaccionImporteCambioExcedente;
    this.secuenciaFormaPagoImporte = secuenciaFormaPagoImporte;
    this.secuenciaFormaPagoImporteCambio = secuenciaFormaPagoImporteCambio;
    this.secuenciaFormaPagoImporteCambioExcedente = secuenciaFormaPagoImporteCambioExcedente;
    this.informacionTipoCambio = informacionTipoCambio;
    this.estatus = estatus;
    this.descuentosPromocionalesPorLineaAplicados = descuentosPromocionalesPorLineaAplicados;
    this.descuentosPromocionalesPorVentaAplicados = descuentosPromocionalesPorVentaAplicados;
  }
}

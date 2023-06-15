import { InformacionTipoCambio } from '../General/InformacionTipoCambio';
import { EstadosPago, TipoPago } from '../../shared/GLOBAL';
import { DescuentoPromocionalAplicado } from '../Sales/DescuentoPromocionalAplicado';


export interface FormaPagoUtilizadoModel {
  autorizacion: string // Se agrega para la redencion de puntos de lealtad
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
  descuentosPromocionalesPorVentaAplicados: { descuentoPromocionesAplicados: Array<DescuentoPromocionalAplicado> };
  descuentosPromocionalesPorLineaAplicados: { descuentoPromocionesAplicados: Array<DescuentoPromocionalAplicado> };
}

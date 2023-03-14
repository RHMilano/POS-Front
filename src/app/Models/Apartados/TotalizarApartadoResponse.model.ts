import { DescuentoPromocionalVentaModel } from '../Pagos/DescuentoPromocionalVenta.model';
import { ConfigGeneralesCajaTiendaFormaPagoModel } from '../General/ConfigGeneralesCajaTiendaFormaPago.model';

export class TotalizarApartadoResponseModel {
  folioOperacion: string;
  descuentosPromocionalesVenta: Array<DescuentoPromocionalVentaModel>;
  informacionAsociadaFormasPago: Array<ConfigGeneralesCajaTiendaFormaPagoModel>;
  informacionAsociadaFormasPagoMonedaExtranjera: Array<ConfigGeneralesCajaTiendaFormaPagoModel>;
}

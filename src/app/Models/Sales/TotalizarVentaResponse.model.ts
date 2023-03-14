import { ProductsResponse } from '../General/ProductsResponse.model';
import { DescuentoPromocionalVentaModel } from '../Pagos/DescuentoPromocionalVenta.model';
import { ConfigGeneralesCajaTiendaFormaPagoModel } from '../General/ConfigGeneralesCajaTiendaFormaPago.model';
import { InformacionAsociadaDevolucionModel } from './InformacionAsociadaDevolucion.model';

export interface TotalizarVentaResponseModel {
  folioOperacion: string;

  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalVentaModel>;
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalVentaModel>;

  descuentosPromocionalesPosiblesVenta: Array<DescuentoPromocionalVentaModel>;
  descuentosPromocionalesPosiblesLinea: Array<DescuentoPromocionalVentaModel>;

  productoPagoConValeMayorista?: ProductsResponse;
  informacionAsociadaFormasPago: Array<ConfigGeneralesCajaTiendaFormaPagoModel>;
  informacionAsociadaFormasPagoMonedaExtranjera: Array<ConfigGeneralesCajaTiendaFormaPagoModel>;

  informacionAsociadaDevolucion: InformacionAsociadaDevolucionModel;
}


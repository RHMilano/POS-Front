import { ArticuloModel, ArticuloModelLight } from './Articulo.model';
import { DescuentoPromocionalLineaModel, DescuentoPromocionalLineaModelLight } from './DescuentoPromocionalLinea.model';
import { DescuentoDirectoLineaModel, DescuentoDirectoLineaModelLight } from './DescuentoDirectoLinea.model';
import { CabeceraVentaRequest } from './CabeceraVentaRequest';
import { TipoDetalleVenta } from '../../shared/GLOBAL';
import { Decimal } from 'decimal.js/decimal';

//-NOTA: Quitar en una prueba del arreglo este segmento
export interface LineaTicketModel {
  secuencia?: number;
  articulo?: ArticuloModel;
  cantidadVendida?: number;
  cantidadDevuelta?: number;
  descuentoDirectoLinea?: DescuentoDirectoLineaModel;
  descuentosPromocionalesPosiblesLinea?: Array<DescuentoPromocionalLineaModel>;
  descuentosPromocionalesAplicadosLinea?: Array<DescuentoPromocionalLineaModel>;
  importeVentaLineaDescuentos?: number;
  importeDevolucionLineaDescuentos?: number;
  importeVentaLineaBruto?: number;
  importeDevolucionLineaBruto?: number;
  importeVentaLineaImpuestos1?: number;
  importeVentaLineaImpuestos2?: number;
  importeDevolucionLineaImpuestos?: number;
  importeVentaLineaNeto?: number;
  importeDevolucionLineaNeto?: number;
  codigoTipoDetalleVenta?: TipoDetalleVenta;
  cabeceraVentaAsociada?: CabeceraVentaRequest;
  perteneceVentaOriginal?: boolean;

  getGrandTotal?(): Decimal;

}

export interface LineaTicketModelDecimal {
  secuencia?: number;
  articulo?: ArticuloModel;
  cantidadVendida?: number;
  cantidadDevuelta?: number;
  descuentoDirectoLinea?: DescuentoDirectoLineaModel;
  descuentosPromocionalesPosiblesLinea?: Array<DescuentoPromocionalLineaModel>;
  descuentosPromocionalesAplicadosLinea?: Array<DescuentoPromocionalLineaModel>;
  importeVentaLineaDescuentos?: Decimal;
  importeDevolucionLineaDescuentos?: Decimal;
  importeVentaLineaBruto?: Decimal;
  importeDevolucionLineaBruto?: Decimal;
  importeVentaLineaImpuestos1?: Decimal;
  importeVentaLineaImpuestos2?: Decimal;
  importeDevolucionLineaImpuestos?: Decimal;
  importeVentaLineaNeto?: Decimal;
  importeDevolucionLineaNeto?: Decimal;
  codigoTipoDetalleVenta?: TipoDetalleVenta;
  cabeceraVentaAsociada?: CabeceraVentaRequest;
  perteneceVentaOriginal?: boolean;

  getGrandTotal?(): Decimal;

}

export interface LineaTicketModelLight {
  secuencia?: number;
  articulo?: ArticuloModelLight;
  cantidadVendida?: number;
  cantidadDevuelta?: number;
  descuentoDirectoLinea?: DescuentoDirectoLineaModelLight;
  descuentosPromocionalesPosiblesLinea?: Array<DescuentoPromocionalLineaModelLight>;
  descuentosPromocionalesAplicadosLinea?: Array<DescuentoPromocionalLineaModelLight>;
  importeVentaLineaDescuentos?: number;
  importeDevolucionLineaDescuentos?: number;
  importeVentaLineaBruto?: number;
  importeDevolucionLineaBruto?: number;
  importeVentaLineaImpuestos1?: number;
  importeVentaLineaImpuestos2?: number;
  importeDevolucionLineaImpuestos?: number;
  importeVentaLineaNeto?: number;
  importeDevolucionLineaNeto?: number;
  codigoTipoDetalleVenta?: TipoDetalleVenta;
  cabeceraVentaAsociada?: CabeceraVentaRequest;
  perteneceVentaOriginal?: boolean;

  getGrandTotal?(): Decimal;

}

import { DescuentoPromocionalLineaModel } from './DescuentoPromocionalLinea.model';

export class OperacionLineaTicketVentaResponse {
  folioOperacion: string;
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalLineaModel>;
  descuentosPromocionalesPosiblesLinea: Array<DescuentoPromocionalLineaModel>;
}

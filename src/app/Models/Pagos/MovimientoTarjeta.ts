import {VentaTarjetaRequest} from './VentaTarjetaRequest';
import {RetiroTarjetaRequest} from './RetiroTarjetaRequest';
import {PuntosTarjetaRequest} from './PuntosTarjetaRequest';
import { CardData } from '../BBVAv2/CardData';
import { SaleRequest } from '../BBVAv2/SaleRequest';

export class MovimientoTarjetaRequest {
  venta: VentaTarjetaRequest;
  retiro: RetiroTarjetaRequest;
  puntos: PuntosTarjetaRequest;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;
  cardData: CardData;
  saleRequest: SaleRequest;
}

export class MovimientoTarjetaResponse {
  codeNumber: number;
  codeDescription: string;
  authorization: string;
  sePuedeRetirar: boolean;
  sePuedePagarConPuntos: boolean;
}

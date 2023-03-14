import { FormaPagoUtilizado } from '../Pagos/FormaPagoUtilizado';
import { LineaTicketModel, LineaTicketModelLight } from './LineaTicket.model';
import { TipoCabeceraTotalizar } from '../../shared/GLOBAL';
import { InformacionMayorista } from './InformacionMayorista';
import { InformacionFoliosTarjeta } from './InformacionFoliosTarjeta';
import { CabeceraVentaRequest } from './CabeceraVentaRequest';
import { environment as env, environment } from '../../../environments/environment';

//-NOTA: Prueba quitando arreglos no necesarios
export class FinalizarVentaRequest {
  folioVenta: string;
  lineasConDigitoVerificadorIncorrecto: Array<LineaTicketModel>;
  lineasTiempoAire?: Array<LineaTicketModel>;
  formasPagoUtilizadas: Array<FormaPagoUtilizado>;
  codigoTipoCabeceraVenta: TipoCabeceraTotalizar;
  informacionMayorista?: InformacionMayorista;
  informacionFoliosTarjeta?: Array<InformacionFoliosTarjeta>;
  cabeceraVentaAsociada: CabeceraVentaRequest;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;
  //versionPOS: string; // OCG Integracion de la version del POS

  //constructor() {
  //this.versionPOS = env.posversion; // OCG inicializacion de la version
  //}

}

export class FinalizarVentaRequestLight {
  folioVenta: string;
  lineasConDigitoVerificadorIncorrecto: Array<LineaTicketModelLight>;
  lineasTiempoAire?: Array<LineaTicketModelLight>; // Ver por se usa dos veces
  formasPagoUtilizadas: Array<FormaPagoUtilizado>;
  codigoTipoCabeceraVenta: TipoCabeceraTotalizar;
  informacionMayorista?: InformacionMayorista;
  informacionFoliosTarjeta?: Array<InformacionFoliosTarjeta>;
  cabeceraVentaAsociada: CabeceraVentaRequest;
  descuentosPromocionalesPorVentaAplicados: any;
  descuentosPromocionalesPorLineaAplicados: any;
}

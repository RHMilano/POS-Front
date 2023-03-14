import { ConfiguracionBoton } from './ConfiguracionBoton';
import { ConfigGeneralesCajaTiendaImpuestoModel } from './ConfigGeneralesCajaTiendaImpuesto.model';
import { ConfigGeneralesRecursoModel } from './ConfigGeneralesRecurso.model';
import {environment as env, environment} from '../../../environments/environment';

export class ConfigGeneralesCajaTiendaResponse {
  abrirCajon: number;
  colorDevoluciones: string;
  colorFormasDePago: string;
  puertoImpresoraTickets: string;
  urlImpresion: string;
  colorVentaEmpleaado: string;
  colorVentaMayorista: string;
  colorVentaRegular: string;
  rutaLogTransacciones: string;
  montoMaximoCambioVales: number;
  skuPagoConValeMayorista: number;
  skuComisionPagoServicios: number;
  skuPagoTCMM: number;
  skuPagoMayorista: number;
  skuPagoComisionMayorista: number;
  porcentajePagoConValeMayorista: number;
  porcentajeMaximoDescuentoDirecto: number;
  montoMinimoAbonoApartado: number;
  montoMinimoPorcentajeApartado: number;
  configuracionBotonera: { configuracionBotones: Array<ConfiguracionBoton> };
  informacionAsociadaImpuestos: ConfigGeneralesCajaTiendaImpuestoModel;
  informacionCatalogoRecursos: Array<ConfigGeneralesRecursoModel>;
  solicitarAutorizacionDescuentos: boolean;
  posModoConsulta: boolean;
  versionPOS:string;
  constructor()
  {
    this.versionPOS = env.posversion;
  }
}

import { ElementoFormulario, InformacionAdicionalPS, InformacionAdicionalPSLight } from './PagoServiciosOpciones.model';

export interface InformacionProveedorExternoPSModel {
  cuenta: string;
  skuCompania: string;
  monto: number;
  infoAdicional: InformacionAdicionalPS;
}

export interface InformacionProveedorExternoPSModelLight {
  cuenta: string;
  skuCompania: string;
  monto: number;
  infoAdicional: InformacionAdicionalPSLight;
}

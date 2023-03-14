import {InformacionVersionSoftware} from './InformacionVersionSoftware';

export class ActualizacionSoftwareResponse {
  codeNumber: string;
  codeDescription: string;
  idVersionBase: number;
  etiquetaLanzamientoVersionBase: string;
  idVersionMaximaActualizacion: number;
  etiquetaLanzamientoVersionMaximaActualizacion: string;
  informacionVersionesSoftwarePendientesPorInstalar: Array<InformacionVersionSoftware>;
}

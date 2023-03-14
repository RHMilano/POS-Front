import { DigitoVerificadorArticuloModel, DigitoVerificadorArticuloModelLight } from './DigitoVerificadorArticulo.model';
import { InformacionProveedorExternoTAModel, InformacionProveedorExternoTAModelLight } from './informacionProveedorExternoTA.model';
import { InformacionTarjetaRegaloModel, InformacionTarjetaRegaloModelLight } from './InformacionTarjetaRegalo.model';
import { InformacionProveedorExternoPSModel, InformacionProveedorExternoPSModelLight } from './InformacionProveedorExternoPS.model';

export interface ArticuloModel {
  sku: number;
  skuCompania: string;
  upc: string;
  codigoMarca: number;
  codigoDepto: number;
  codigoSubDepto: number;
  codigoClase: number;
  codigoSubClase: number;
  clase: string;
  subClase: string;
  subDepartamento: string;
  precioConImpuestos: number;
  precioCambiadoConImpuestos: number;
  precioCambiadoImpuesto1: number;
  precioCambiadoImpuesto2: number;
  rutaImagenLocal: string;
  rutaImagenRemota: string;
  impuesto1: number;
  tasaImpuesto1: number;
  impuesto2: number;
  tasaImpuesto2: number;
  digitoVerificadorArticulo: DigitoVerificadorArticuloModel;
  estilo: string;
  codigoImpuesto1: string;
  codigoImpuesto2: string;
  depto: string;
  informacionProveedorExternoTA: InformacionProveedorExternoTAModel;
  informacionProveedorExternoAsociadaPS: InformacionProveedorExternoPSModel;
  informacionTarjetaRegalo: InformacionTarjetaRegaloModel;
  informacionPagoTCMM: {
    numeroTarjeta: number;
  },
  esTarjetaRegalo: boolean;
  isPagoCreditoMayorista?: boolean;
  isPagoComisionCreditomMayorista?: boolean;
  isPagoTCMM?: boolean;
  isPagoWeb?: boolean; // OCG: Definir el tipo pago web como propiedad
}

export interface ArticuloModelLight {
  sku: number;
  skuCompania: string;
  upc: string;
  codigoMarca: number;
  codigoDepto: number;
  codigoSubDepto: number;
  codigoClase: number;
  codigoSubClase: number;
  clase: string;
  subClase: string;
  subDepartamento: string;
  precioConImpuestos: number;
  precioCambiadoConImpuestos: number;
  precioCambiadoImpuesto1: number;
  precioCambiadoImpuesto2: number;
  rutaImagenLocal: string;
  rutaImagenRemota: string;
  impuesto1: number;
  tasaImpuesto1: number;
  impuesto2: number;
  tasaImpuesto2: number;
  digitoVerificadorArticulo: DigitoVerificadorArticuloModelLight;
  estilo: string;
  codigoImpuesto1: string;
  codigoImpuesto2: string;
  depto: string;
  informacionProveedorExternoTA: InformacionProveedorExternoTAModelLight;
  informacionProveedorExternoAsociadaPS: InformacionProveedorExternoPSModelLight;
  informacionTarjetaRegalo: InformacionTarjetaRegaloModelLight;
  informacionPagoTCMM: {
    numeroTarjeta: number;
  },
  esTarjetaRegalo: boolean;
  isPagoCreditoMayorista?: boolean;
  isPagoComisionCreditomMayorista?: boolean;
  isPagoTCMM?: boolean;
  isPagoWeb?: boolean; // OCG: Definir el tipo pago web como propiedad
}

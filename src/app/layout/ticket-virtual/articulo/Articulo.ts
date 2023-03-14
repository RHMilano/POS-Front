import { ArticuloModel } from '../../../Models/Sales/Articulo.model';
import { DigitoVerificadorArticuloModel } from '../../../Models/Sales/DigitoVerificadorArticulo.model';
import { InformacionProveedorExternoPSModel } from '../../../Models/Sales/InformacionProveedorExternoPS.model';
import { InformacionProveedorExternoTAModel } from '../../../Models/Sales/informacionProveedorExternoTA.model';
import { InformacionTarjetaRegaloModel } from '../../../Models/Sales/InformacionTarjetaRegalo.model';
import { Decimal } from 'decimal.js/decimal';

export class Articulo implements ArticuloModel {
  clase: string;
  codigoClase: number;
  codigoDepto: number;
  codigoImpuesto1: string;
  codigoImpuesto2: string;
  codigoMarca: number;
  codigoSubClase: number;
  codigoSubDepto: number;
  depto: string;
  descripcionProveedor: string;
  digitoVerificadorArticulo: DigitoVerificadorArticuloModel;
  estilo: string;
  impuesto1: number;
  impuesto2: number;
  informacionProveedorExternoAsociadaPS: InformacionProveedorExternoPSModel;
  informacionProveedorExternoTA: InformacionProveedorExternoTAModel;
  informacionTarjetaRegalo: InformacionTarjetaRegaloModel;
  precioCambiadoConImpuestos: number;
  precioCambiadoImpuesto1: number;
  precioCambiadoImpuesto2: number;
  precioConImpuestos: number;
  rutaImagenLocal: string;
  rutaImagenRemota: string;
  sku: number;
  skuCompania: string;
  subClase: string;
  subDepartamento: string;
  tasaImpuesto1: number;
  tasaImpuesto2: number;
  upc: string;
  esTarjetaRegalo: boolean;

  isPagoComisionCreditomMayorista: boolean;
  isPagoCreditoMayorista: boolean;
  isPagoTCMM: boolean;
  isPagoWeb: boolean; //OCG: Definir el tipo en el artículo
  informacionPagoTCMM: { numeroTarjeta: number };


  constructor(params: ArticuloModel = {} as ArticuloModel) {
    const {
      clase = '',
      codigoClase = 0,
      codigoDepto = 0,
      codigoImpuesto1 = '',
      codigoImpuesto2 = '',
      codigoMarca = 0,
      codigoSubClase = 0,
      codigoSubDepto = 0,
      depto = '',
      digitoVerificadorArticulo = {digitoVerificadorActual: '', digitoVerificadorCorrecto: '', inconsistencia: false},
      estilo = '',
      impuesto1 = 0,
      impuesto2 = 0,
      informacionProveedorExternoAsociadaPS = null,
      informacionProveedorExternoTA = null,
      informacionTarjetaRegalo = null,
      precioCambiadoConImpuestos = 0,
      precioCambiadoImpuesto1 = 0,
      precioCambiadoImpuesto2 = 0,
      precioConImpuestos = 0,
      rutaImagenLocal = '',
      rutaImagenRemota = '',
      sku = 0,
      skuCompania = '',
      subClase = '',
      subDepartamento = '',
      tasaImpuesto1 = 16,
      tasaImpuesto2 = 0,
      upc = '',
      esTarjetaRegalo = false,
      isPagoComisionCreditomMayorista = false,
      isPagoCreditoMayorista = false,
      isPagoTCMM = false,
      isPagoWeb = false, 
      informacionPagoTCMM = null
    } = params;

    this.clase = clase;
    this.codigoClase = codigoClase;
    this.codigoDepto = codigoDepto;
    this.codigoImpuesto1 = codigoImpuesto1;
    this.codigoImpuesto2 = codigoImpuesto2;
    this.codigoMarca = codigoMarca;
    this.codigoSubClase = codigoSubClase;
    this.codigoSubDepto = codigoSubDepto;
    this.depto = depto;
    this.digitoVerificadorArticulo = digitoVerificadorArticulo;
    this.estilo = estilo;
    this.impuesto1 = impuesto1;
    this.impuesto2 = impuesto2;
    this.informacionProveedorExternoAsociadaPS = informacionProveedorExternoAsociadaPS;
    this.informacionProveedorExternoTA = informacionProveedorExternoTA;
    this.informacionTarjetaRegalo = informacionTarjetaRegalo;
    this.precioCambiadoConImpuestos = precioCambiadoConImpuestos;
    this.precioCambiadoImpuesto1 = precioCambiadoImpuesto1;
    this.precioCambiadoImpuesto2 = precioCambiadoImpuesto2;
    this.precioConImpuestos = precioConImpuestos;
    this.rutaImagenLocal = rutaImagenLocal;
    this.rutaImagenRemota = rutaImagenRemota;
    this.sku = sku;
    this.skuCompania = skuCompania;
    this.subClase = subClase;
    this.subDepartamento = subDepartamento;
    this.tasaImpuesto1 = tasaImpuesto1;
    this.tasaImpuesto2 = tasaImpuesto2;
    this.upc = upc;
    this.esTarjetaRegalo = esTarjetaRegalo;
    this.isPagoComisionCreditomMayorista = isPagoComisionCreditomMayorista;
    this.isPagoTCMM = isPagoTCMM;
    this.isPagoWeb = isPagoWeb;// OCG: Asignación de valor por defecto
    this.isPagoCreditoMayorista = isPagoCreditoMayorista;
    this.informacionPagoTCMM = informacionPagoTCMM;
  }

  getArticulo(): ArticuloModel {
    return {
      sku: this.sku,
      impuesto1: this.impuesto1,
      precioCambiadoImpuesto1: this.precioCambiadoImpuesto1,
      tasaImpuesto1: this.tasaImpuesto1,
      tasaImpuesto2: this.tasaImpuesto2,
      precioConImpuestos: this.precioConImpuestos,
      precioCambiadoConImpuestos: this.precioCambiadoConImpuestos,
      clase: this.clase,
      codigoClase: this.codigoClase,
      codigoDepto: this.codigoDepto,
      codigoImpuesto1: this.codigoImpuesto1,
      codigoImpuesto2: this.codigoImpuesto2,
      codigoMarca: this.codigoMarca,
      codigoSubClase: this.codigoSubClase,
      codigoSubDepto: this.codigoSubDepto,
      depto: this.depto,
      estilo: this.estilo,
      impuesto2: this.impuesto2,
      precioCambiadoImpuesto2: this.precioCambiadoImpuesto2,
      rutaImagenLocal: this.rutaImagenLocal,
      rutaImagenRemota: this.rutaImagenRemota,
      skuCompania: this.skuCompania,
      subClase: this.subClase,
      subDepartamento: this.subDepartamento,
      upc: this.upc,
      informacionTarjetaRegalo: this.informacionTarjetaRegalo,
      informacionProveedorExternoAsociadaPS: this.informacionProveedorExternoAsociadaPS,
      digitoVerificadorArticulo: this.digitoVerificadorArticulo,
      informacionProveedorExternoTA: this.informacionProveedorExternoTA,
      esTarjetaRegalo: this.esTarjetaRegalo,
      informacionPagoTCMM: this.informacionPagoTCMM
    };
  }

  updatePrice?(newPrice) {
    this.precioCambiadoConImpuestos = Number(newPrice);
    this.precioCambiadoImpuesto1 = Number(newPrice) - (Number(newPrice) / ((this.tasaImpuesto1 / 100) + 1));
    if (this.tasaImpuesto2) {
      this.precioCambiadoImpuesto2 = Number(newPrice) - (Number(newPrice) / ((this.tasaImpuesto2 / 100) + 1));
    }
  }

  getPrecioConImpuestos?() {
    return new Decimal(this.precioCambiadoConImpuestos || this.precioConImpuestos).toDP(2, 1);
  }

  getImpuesto1?() {
    return new Decimal(this.precioCambiadoImpuesto1 || this.impuesto1).toDP(2, 1);
  }

  getImpuesto2?() {
    return new Decimal(this.precioCambiadoImpuesto2 || this.impuesto2).toDP(2, 1);
  }

  getImpuestoTotal?() {
    return this.getImpuesto1().plus(this.getImpuesto2()).toDP(2, 1);
  }

  getPrecioBruto1?() {
    return this.getPrecioConImpuestos().dividedBy(new Decimal(this.tasaImpuesto1).dividedBy(100).plus(1)).toDP(2, 1);
  }


  calculaPrecioPagoServicio(cantidadPagar: number) {
    this.precioConImpuestos = cantidadPagar;
  }

  calculaImpuestoComisionTransaccion() {
    const porcentajeImpuesto = this.tasaImpuesto1 / 100;
    this.impuesto1 = (this.precioConImpuestos / (porcentajeImpuesto + 1)) * porcentajeImpuesto;
  }

}

import { isArray } from 'rxjs/util/isArray';
import { InformacionProveedorExternoTAModel } from '../Models/Sales/informacionProveedorExternoTA.model';
import { InformacionProveedorExternoPSModel } from '../Models/Sales/InformacionProveedorExternoPS.model';
import { InformacionTarjetaRegaloModel } from '../Models/Sales/InformacionTarjetaRegalo.model';
import { ArticuloModel } from '../Models/Sales/Articulo.model';
import { LineaTicket } from '../Models/Sales/LineaTicket';


export enum RouterCommand {
  mayorista = '/POS/MAYORISTA',
  regular = '/POS',
  login = '/',
  empleado = '/POS/EMPLEADO',
  devolucion = '/POS/DEVOLUCION'
}

export enum TipoElementoFormulario {
  input = 'input',
  select = 'select',
  submit = 'submit'
}

export enum TipoInputFormulario {
  dinero = 'dinero',
  fecha = 'fecha',
  numero = 'numero',
  password = 'password',
  submit = 'submit',
  texto = 'texto'
}

export enum tipoCapturaLuz {
  inicio = 'Inicio',
  fin = 'Fin'
}

export enum ClasificacionVenta {
  regular = 'REGULAR',
  apartado = 'APARTADO'
}

export enum FlujoBloqueo {
  reset = 'reset',
  removedItem = 'remItem',
  selectedItem = 'selectedItem',
  inicioVentaEmpleado = 'initEmpleado',
  inicioVentaMayorista = 'initMayorista',
  inicioDevoluciones = 'iniDevolucion',
  finDevoluciones = 'finDevoluciones',
  inicioApartados = 'iniApartado',
  inicioTotalizar = 'iniTotalizar',
  falloTotalizar = 'failTotalizar',
  efectivoAgregado = 'efectivoAgregado',
  financiamientoAgregado = 'financiamientoAgregado',
  efectivoEliminado = 'efectivoEliminado',
  iniciaFinanciamiento = 'iniciaFinanciamiento',
  medioTotalizar = 'medioTotalizar'
}

export enum TipoDescuento {
  porcentaje = 'I2',
  importe = 'I1',
  porcentajeTransaccion = 'T2',
  importeTransaccion = 'T1',
  picos = 'picos',
  danada = 'danada'
}

export enum EntidadesFederativas {
  Aguascalientes = 'Aguascalientes',
  BajaCalifornia = 'Baja California',
  BajaCaliforniaSur = 'Baja California Sur',
  Campeche = 'Campeche',
  Chiapas = 'Chiapas',
  Chihuahua = 'Chihuahua',
  Coahuila = 'Coahuila',
  Colima = 'Colima',
  CiudaddeMexico = 'Ciudad de Mexico',
  Durango = 'Durango',
  Guanajuato = 'Guanajuato',
  Guerrero = 'Guerrero',
  Hidalgo = 'Hidalgo',
  Jalisco = 'Jalisco',
  Mexico = 'Mexico',
  Michoacan = 'Michoacan',
  Morelos = 'Morelos',
  Nayarit = 'Nayarit',
  NuevoLeon = 'NuevoLeon',
  Oaxaca = 'Oaxaca',
  Puebla = 'Puebla',
  Queretaro = 'Queretaro',
  QuintanaRoo = 'QuintanaRoo',
  SanLuisPotosi = 'SanLuisPotosi',
  Sinaloa = 'Sinaloa',
  Sonora = 'Sonora',
  Tabasco = 'Tabasco',
  Tamaulipas = 'Tamaulipas',
  Tlaxcala = 'Tlaxcala',
  Veracruz = 'Veracruz',
  Yucatan = 'Yucatan',
  Zacatecas = 'Zacatecas'
}

export enum OrigenPago {
  normal = 'Normal',
  tarjetaCmm = 'Tarjeta credito MM',
  apartado = 'Apartado'
}

export enum EstadosPago {
  Apartado = 'AR',
  Cancelado = 'PC',
  Pendiente = 'PP',
  Registrado = 'PR',
  Exitoso = 'PE'
}

export enum PagosOps {
  efectivo = 'Efectivo',
  tarjetaMM = 'Tarjeta MM',
  tarjetaCreditoDebit = 'Tarjeta',
  tarjetaCreditoDebit2 = 'TarjetaV2',// OCG
  tarjetaVisa = 'Tarjeta VISA',
  //tarjetaVisa2 = 'Tarjeta VISA', // OCG
  tarjetaRegalo = 'Tarjeta de regalo',
  notaCredito = 'NOTA DE CREDITO EMITIDO',
  financiamento = 'Financiamento',
  financiamientoMayorista = 'Financiamiento Mayorista',
  vales = 'Vales',
  monedaExtranjera = 'Moneda extranjera',
  americanExpress = 'Tarjeta American express',
  masFunciones = 'Mas Formas de Pago',
  valeV1 = 'Vale EDENRED',
  valeV2 = 'Vale SI VALE',
  valeV3 = 'Vale SERVI-BONO',
  valeV4 = 'Vale SODEXHO',
  valeV5 = 'Vale EFECTIVALE',
  valeV6 = 'Vale CANACO CAMPECHE',
  valeV7 = 'Vale ECOVALE OPAM',
  valeV8 = 'Vale MILANO MELODY',
  valeV9 = 'Vale MONTEMEX',
  finLag = 'Finlag',
  cupones = 'Redencion de Cupones',
  pinpadMov = 'Pin Pad Móvil',
  transferencia = 'Transferencia Bancaria', //? OCG integracion de nueva forma de pago
  pagoLealtad = 'Puntos Lealtad' //? OCG integracion de nueva forma de pago
}

export enum CambioPagos {
  quetzales = '1',
  dolares = '1',
  quetzal = '1',
  vales = 1,
  cambiovales = 0
}

export enum TipoDivisaDesc {
  quetzales = 'QUE',
  dolares = 'USD',
}

export enum TipoCorte {
  corteZ = 'Z',
  corteX = 'X'
}

export enum TipoPago {
  efectivo = 'CA',
  tarjetaMM = 'VY',
  tarjetaCreditoDebit = 'TC',
  tarjetaCreditoDebit2 = 'BB',
  tarjetaVisa = 'VI',
  americanExpress = 'AX',
  tarjetaRegalo = 'GC',
  notaCredito = 'DR',
  financiamento = 'FN',
  financiamientoMayorista = 'M',
  vales = 'VA',
  dolares = 'US',
  quetzales = 'UC',
  monedaExtranjera = 'UC,US',
  valeV1 = 'V1', 
  valeV2 = 'V2',
  valeV3 = 'V3',
  valeV4 = 'V4',
  valeV5 = 'V5',
  valeV6 = 'V6',
  valeV7 = 'V7',
  valeV8 = 'V8',
  valeV9 = 'V9',
  cambio = 'CA',
  cashBack = 'BC',
  finLag = 'FL',
  cupones = 'CP',
  pinpadMov = 'TC',
  transferencia = 'TR',
  pagoLealtad = 'PL'
}

export enum TipoPagoFinLag {
  Normal = 'NORMAL',
  Promocion = 'PAGUE HASTA'
}
/* TIPOS DE PAGOS AGRUPADOS POR BOTON, SI SE AGREGA UN TIPO DE PAGO, TAMBIEN SE DEBE AGREGAR A TipoPagoAccesoBoton */

export enum TipoPagoAccesoBoton {
  efectivo = 'CA',
  tarjetaMM = 'VY',
  tarjetaCreditoDebit = 'TC',
  tarjetaCreditoDebit2 = 'BB',
  tarjetaVisa = 'VI',
  americanExpress = 'AX',
  tarjetaRegalo = 'GC',
  notaCredito = 'DB',
  financiamento = 'FN',  // Tipo Pago Financiamiento => Mayorista, Empleado y Apartados
  monedaExtranjera = 'UC,US',  //  Tipo Pago Moneda Extranjera
  vales = 'V1,V2,V3,V4,V5,V6,V7,V8,V9',  // Tipo Pago Vales
  cambio = 'CA',
  cashBack = 'BC',
  finLag = 'FL',
  cupones = 'CP',
  pinpadMov = 'DE',
  transferencia = 'TR',
  pagoLealtad = 'PL'
}

export enum TipoCabeceraTotalizar {
  ventaRegular = '1',
  ventaEmpleado = '4',
  ventaMayorista = '2',
  tiempoAire = '5',
  servicios = '6',
  apartado = '1', // '62',
  devolucionRegular = '11',
  devolucionEmpleado = '14',
  devolucionMayoristas = '22',
  tarjetaMM = '46',
  pagoWeb = '48', // OCG: Agregar el tipo Pago Web
}

export enum TipoDetalleVenta {
  ticketVirtual = 1,
  apartado = '50',
  devolucionRegular = '11',
  devolucionEmpleado = '14',
  devolucionMayoristas = '22',
  tarjetaMM = '46',
  tarjetaRegaloMM = '44',
  tiempoAire = '5',
  servicios = '6',
  agregarLineaTicket = '1',
  agregarLineaMayorista = '2',
  agregarLineaEmpleado = '4',
  agregarLineaTiempoAire = '5',
  agregarLineaServicios = '6',
  agregarLineaComisionServicios = '7',
  agregarLineaPagoCreditoMayorista = '43',
  agregarLineaComisionPagoCreditoMayorista = '1C',
  eliminarLineaTicket = '87',
  pagoWeb = '48' //OCG: Definición del tipo de detalle
}

export enum TipoVenta {
  VentaRegular = 'colorVentaRegular',
  VentaEmpleado = 'colorVentaEmpleaado',
  VentaMayorista = 'colorVentaMayorista',
  devoluciones = 'colorDevoluciones',
  formasDepago = 'colorFormasDePago',
  Apartado = 'colorVentaApartado'
}

export enum TipoReporte {
  departamento = 'departamento',
  sku = 'sku',
  vendedor = 'vendedor',
  caja = 'caja',
  hr = 'hr',
  detalle = 'detalle',
  sinDetalle = 'sinDetalle',
  devoluciones = 'devoluciones',
  ingEgresos = 'ingEgresos'
}

export enum TiposProductos {
  prenda = 'prenda',
  tiempoAire = 'tiempoAire',
  servicio = 'servicio',
  tarjetaRegalo = 'tarjetaRegalo',
  lineaSkuMayorista = 'lineaSkuMayorista',
  lineaComisionServicios = 'lineaComisionServicios',
  lineaComisionPagoMayorista = 'lineaComisionPagoMayorista',
  lineaPagoAMayorista = 'lineaPagoAMayorista',
  lineaPagoTCMM = 'lineaPagoTCMM',
  lineaPagoWeb = 'lineaPagoWeb' // OCG: Tipo de producto Pago Web
}

export enum TipoCancelacionVenta {
  cancelacionTicket = 'cancelarTicket'
}

export enum EstatusTarjetaRegalo {
  CanjeadoConSaldo = 'C',
  CanjeadoSinSaldo = 'CC',
  ListaParaVender = 'I',
  Activada = 'A'
}

export enum TipoApartado {
  Cancelacion = 1,
  Abono = 3,
  Liquidacion = 2
}

export enum EstatusTransaccion {
  Suspendida = 'S',
  Finalizada = 'F'
}

export enum EstatusApartado {
  Vigente = 'Vigente',
  Cedido = 'Cedido',
  Cancelado = 'Anulado',
  Liquidado = 'Liquidado',
  Finalizado = 'Finalizado',
  Totalizado = 'Totalizado',
  Nuevo = 'Nuevo'
}

export enum EstatusApartadoLetras {
  Vigente = 'V',
  Cedido = 'C',
  Cancelado = 'A',
  Liquidado = 'L',
  Finalizado = 'F',
  Totalizado = 'T',
  Nuevo = 'N'
}

export enum BotonesPagos {
  CancelarApartados = 'Cancelar',
  LiquidarApartados = 'Liquidar Apartado',
  FinalizarVenta = 'Finalizar Venta',
  RegresarVenta = 'Regresar'
}

export const GLOBAL = {
  skuPagoMayorista: 0,
  skuLineaComisionPagoServicios: 0,
  informacionAsociadaImpuestos: null,
  upperCaseFirst(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  checkToArray: (obj: any): Array<any> => {
    if (!isArray(obj)) {
      if (obj) {
        return [obj];
      } else {
        return [];
      }
    } else {
      return obj;
    }
  },

  includesAny: (testStr, checkList): boolean => checkList.reduce((prev, curr) => prev || testStr.includes(curr), false),

  fileExists: (image_url: string): Promise<string> => {
    try {

      return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.open('HEAD', image_url, true);

        http.onreadystatechange = function () {
          if (http.readyState === 4) {

            if (http.status === 404) {
              reject('');
            } else {
              resolve(image_url);
            }

          }
        };

        http.send();


      });
    } catch (e) {
      return Promise.reject(e);
    }
  },
  isTypeTiempoAire(value: any): value is InformacionProveedorExternoTAModel {
    return value
      && (typeof value.numeroTelefonico === 'string')
      && !!value.skuCompania;
  },
  isTypePagoServicios(value: any): value is InformacionProveedorExternoPSModel {
    return value
      && (typeof value.cuenta === 'string')
      && !!value.skuCompania;
  },
  isTypeTarjetaRegalo(value: any): value is InformacionTarjetaRegaloModel {
    return value
      && (typeof value.descripcion === 'string')
      && !!value.folioTarjeta;
  },
  isTypeLineaSku(value: any) {
    return value.sku === GLOBAL.skuPagoMayorista;
  },
  isTypeLineaComisionPagoServicios(value: any) {
    return value.sku === GLOBAL.skuLineaComisionPagoServicios;
  },
  isTypeLineaComisionPagoMayorista(value: any) {
    return value.isPagoComisionCreditomMayorista === true;
  },
  isTypePagoMayorista(value: any) {
    return value.isPagoCreditoMayorista === true;
  },
  isTypeLineaPagoTCMM(value: any) {
    return value.isPagoTCMM === true;
  },
  isTypeLineaPagoWeb(value: any) { // OCG: Valida si la línea es de Pago Web
    return value.isPagoWeb === true;
  },
  isLineaTicket(arg: any): arg is LineaTicket {
    return arg.secuencia !== undefined;
  },
  getArticuloType(articulo: ArticuloModel): TiposProductos {

    let tipoItem: TiposProductos;

    if (GLOBAL.isTypeTiempoAire(articulo.informacionProveedorExternoTA)) {
      tipoItem = TiposProductos.tiempoAire;
    } else if (GLOBAL.isTypeLineaComisionPagoServicios(articulo)) {
      tipoItem = TiposProductos.lineaComisionServicios;
    } else if (GLOBAL.isTypePagoServicios(articulo.informacionProveedorExternoAsociadaPS)) {
      tipoItem = TiposProductos.servicio;
    } else if (articulo.esTarjetaRegalo) {
      tipoItem = TiposProductos.tarjetaRegalo;
    } else if (GLOBAL.isTypeTarjetaRegalo(articulo.informacionTarjetaRegalo)) {
      tipoItem = TiposProductos.tarjetaRegalo;
    } else if (GLOBAL.isTypeLineaSku(articulo)) {
      tipoItem = TiposProductos.lineaSkuMayorista;
    } else if (GLOBAL.isTypeLineaComisionPagoMayorista(articulo)) {
      tipoItem = TiposProductos.lineaComisionPagoMayorista;
    } else if (GLOBAL.isTypePagoMayorista(articulo)) {
      tipoItem = TiposProductos.lineaPagoAMayorista;
    } else if (GLOBAL.isTypeLineaPagoTCMM(articulo)) {
      tipoItem = TiposProductos.lineaPagoTCMM;
    } else if (GLOBAL.isTypeLineaPagoWeb(articulo)) { // OCG: Identificar el tipo de pago web
      tipoItem = TiposProductos.lineaPagoWeb;
    } else {
      tipoItem = TiposProductos.prenda;
    }
    return tipoItem;

  }

};



import { Decimal } from 'decimal.js/decimal';

export class SolicitudAutorizacionDescuentoRequest {
  codigoTienda: number;
  folioVenta: string;//consecutivoVenta
  montoVenta: Decimal; //Monto de la venta
  codigoCaja: number;
  //fecha: Date; //OCG: Se va a recuperar del backend la fecha
  codigoRazonDescuento:number;
  opcionDescuento:number;
  tipoDescuento: string;
  montoDescuento: number
  linea: number;
  //autorizado
  //fechaAutorizacion
  //nombreAutorizo
  sku: number;
  //descripcion: string;
 
  //descuento: number;
  //precioFinal: number;
  
}


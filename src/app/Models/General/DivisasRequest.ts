export class DivisasRequest {
  importeMonedaNacional: number;
  codigoTipoDivisa: string;
}

export class DivisasResponse {
  importeMonedaNacional: number;
  importeMonedaExtranjera: number;
  tasaConversionVigente: number;
  // OCG 20201028: Se agregan como cumplimiento de certifiacion de Punto Clave
  montoMaximoRecibir: number;
  montoMaximoCambio: number
}

// OCG: Interfaces para la solicitud de la autorizacion de venta con dolares de Punto Clave
export class VentaDolaresRequest {
  storeTeller: string; // Nombre del usuario o cajero del comercio/sucursal que realiza la operación
  receivedAmount: string; //  Monto correspondiente a la cantidad en Moneda Extranjera que se recibe por la venta/servicio
  purchaseAmount: string; // Monto correspondiente a la cantidad de la venta/servicio
  UsedExchangeRate: string // Monto correspondiente al tipo de cambio que se desea utilizar para la venta
  idMerchantTransaction: string // Número o ID de transacción del comercio para la venta
}

// OCG: Interfaces para la respuesta de la autorizacion de venta con dolares de Punto Clave
export class VentaDolaresResponse {
  idTrans: string; // ID único de la transacción, asignado por el servidor.
  authoNumber: string; //  Número de autorización asignado por el servidor
  responseCode: string; //  Código de respuesta de la operación. “000” indica que fue exitosa.Cualquier otro valor indica un error
  responseMessage: string // 
}


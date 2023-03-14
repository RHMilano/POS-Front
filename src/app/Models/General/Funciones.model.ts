export enum Botones {
  ventaRegular = 'ventaRegular',
  ventaEmpleado = 'ventaEmpleado',
  ventaMayoristas = 'ventaMayoristas',
  buesquedaLealtad = 'buesquedaLealtad',
  apartados = 'apartados',
  creacionApartado = 'creacionApartado',
  abonoApartado = 'abonoApartado',
  liquidacioApartado = 'liquidacioApartado',
  cancelacionApartado = 'cancelacionApartado',
  devoluciones = 'devoluciones',
  totalizarVenta = 'totalizarVenta',
  buscarVendedor = 'buscarVendedor',
  buscarPrecio = 'buscarPrecio',
  cancelar = 'cancelar',
  otrosIngresos = 'otrosIngresos',
  tiempoAire = 'tiempoAire',
  pagoServicios = 'pagoServicios',
  pagoMayorista = 'pagoMayorista',
  pagoWebx = 'pagoWebx',
  modificarTransaccion = 'modificarTransaccion',
  suspenderTransaccion = 'suspenderTransaccion',
  recuperarTransaccion = 'recuperarTransaccion',
  operacionesTarjetaMM = '  operacionesTarjetaMM = \'Operaciones TMM\',\n',
  consultaSaldoMM = 'consultaSaldoMM',
  pagoTarjetaMM = 'pagoTarjetaMM',
  gerente = 'gerente',
  reimpresionTicket = 'reimpresionTicket',
  retiroEfectivo = 'retiroEfectivo',
  lecturaX = 'lecturaX',
  lecturaZ = 'lecturaZ',
  cambiarPassword = 'cambiarPassword',
  reset = 'reset',
  cambiarPrecioArticulo = 'cambiarPrecioArticulo',
  descuentos = 'descuentos',
  cashBack = 'cashBack',
  descuentoPorcentaje = 'descuentoPorcentaje',
  descuentoImporte = 'descuentoImporte',
  descuentoTransaccionPorcentaje = 'descuentoTransaccionPorcentaje',
  descuentoTransaccionImporte = 'descuentoTransaccionImporte',
  picosMercancia = 'picosMercancia',
  mercanciaDanada = 'picosMercancia',
  tarjetaRegalo = 'tarjetaRegalo',
  postAnulacion = 'postAnulacion',
  blockAll = 'blockAll',
  backoffice = 'botonBackoffice'
}

export const Btns: { [string: string]: string } = {};

export class BotoneraPeticion {
  action: string;
  boton: Botones;
  dontHidde?: boolean;
}

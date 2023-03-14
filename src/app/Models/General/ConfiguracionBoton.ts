import { Botones } from './Funciones.model';

export interface ConfiguracionBotonModel {
  orden: number;
  textoDescripcion: string;
  rutaImagen: string;
  teclaAccesoRapido: string;
  visible: boolean;
  habilitado: boolean;
  tooltip: string;
  identificador: string;
  configuracionSubBotones: Array<ConfiguracionBoton>;
  handler?: string;
  clase?: string;
  configOriginal?: ConfiguracionBoton;
  mostrandoHijos?: boolean;
}

export class ConfiguracionBoton implements ConfiguracionBotonModel {
  clase?: string;
  configuracionSubBotones: Array<ConfiguracionBoton> = [];
  habilitado: boolean;
  handler?: string;
  identificador: string;
  orden: number;
  rutaImagen: string;
  teclaAccesoRapido: string;
  textoDescripcion: string;
  tooltip: string;
  visible: boolean;
  configOriginal?: ConfiguracionBoton;
  mostrandoHijos?: boolean;
  btnParent?: ConfiguracionBoton;

  constructor(params: ConfiguracionBoton = {} as ConfiguracionBoton, parent?: ConfiguracionBoton) {
    const {
      configuracionSubBotones = [],
      habilitado = true,
      identificador = '',
      orden = 0,
      rutaImagen = '',
      teclaAccesoRapido = '',
      textoDescripcion = '',
      visible = true
    } = this.configOriginal = params;

    this.textoDescripcion = textoDescripcion;
    this.habilitado = habilitado;
    this.identificador = identificador;
    this.orden = orden;
    this.rutaImagen = rutaImagen;
    this.teclaAccesoRapido = teclaAccesoRapido;
    this.visible = visible;
    this.tooltip = '';
    this.handler = configuracionSubBotones.length ? 'showChilds' : this.identificador;
    this.mostrandoHijos = false;

    this.btnParent = parent;

    if (this.identificador === Botones.gerente || this.identificador === Botones.descuentos || this.identificador === Botones.backoffice) {
      this.handler = 'showChildsSudo';
    }

    configuracionSubBotones.map(btn => btn).filter(btn => btn.visible).sort((a, b) => a.orden - b.orden).forEach(btn => {
      this.tooltip += '<li>' + btn.textoDescripcion + '</li>';
      this.configuracionSubBotones.push(new ConfiguracionBoton(btn, this));
    });

  }

  findChild?(identificador: string): ConfiguracionBoton {
    return this.configuracionSubBotones.find(btn => btn.identificador === identificador);
  }

  resetConfig?() {
    this.visible = this.configOriginal.visible;
    this.habilitado = this.configOriginal.habilitado;
    this.mostrandoHijos = false;
    this.configuracionSubBotones.map(btn => btn.resetConfig());
  }

}

export const MockBtnConfig: Array<ConfiguracionBoton> = [
  {
    orden: 1,
    identificador: 'ventaRegular',
    textoDescripcion: 'Venta Regular',
    rutaImagen: 'assets/images/botones_funciones/venta-regular.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [],
    tooltip: '',
    teclaAccesoRapido: 'F1'
  },
  {
    orden: 2,
    identificador: 'ventaEmpleado',
    textoDescripcion: 'Venta Empleado',
    rutaImagen: 'assets/images/botones_funciones/venta-regular.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [],
    tooltip: '',
    teclaAccesoRapido: 'F2'
  },
  {
    orden: 3,
    identificador: 'ventaMayoristas',
    textoDescripcion: 'Venta Mayorista',
    rutaImagen: 'assets/images/botones_funciones/venta-regular.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [],
    tooltip: '',
    teclaAccesoRapido: 'F3'
  },
  {
    orden: 4,
    identificador: 'apartados',
    textoDescripcion: 'Apartados',
    rutaImagen: 'assets/images/botones_funciones/apartado.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [
      {
        orden: 1,
        identificador: 'creacionApartado',
        textoDescripcion: 'Creación Apartado',
        rutaImagen: 'assets/images/botones_funciones/apartado.png',
        habilitado: true,
        visible: true,
        configuracionSubBotones: [],
        tooltip: '',
        teclaAccesoRapido: 'F1'
      },
      {
        orden: 2,
        identificador: 'abonoApartado',
        textoDescripcion: 'Abono/Liquidación Apartado',
        rutaImagen: 'assets/images/botones_funciones/apartado.png',
        habilitado: true,
        visible: true,
        configuracionSubBotones: [],
        tooltip: '',
        teclaAccesoRapido: 'F2'
      },
      {
        orden: 3,
        identificador: 'cancelacionApartado',
        textoDescripcion: 'CancelaciónApartado',
        rutaImagen: 'assets/images/botones_funciones/apartado.png',
        habilitado: true,
        visible: true,
        configuracionSubBotones: [],
        tooltip: '',
        teclaAccesoRapido: 'F3'
      }
    ],
    tooltip: '',
    teclaAccesoRapido: 'F4'
  },
  {
    orden: 5,
    identificador: 'devoluciones',
    textoDescripcion: 'Devoluciones',
    rutaImagen: 'assets/images/botones_funciones/devolucion.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [],
    tooltip: '',
    teclaAccesoRapido: 'F5'
  },
  {
    orden: 6,
    identificador: 'totalizarVenta',
    textoDescripcion: 'Totalizar Venta',
    rutaImagen: 'assets/images/botones_funciones/totalizar.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [],
    tooltip: '',
    teclaAccesoRapido: 'F6'
  }, {
    orden: 7,
    identificador: 'buscarVendedor',
    textoDescripcion: 'Buscar Vendedor',
    rutaImagen: 'assets/images/botones_funciones/buscar-empleado.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [],
    tooltip: '',
    teclaAccesoRapido: 'F7'
  }, {
    orden: 8,
    identificador: 'buscarPrecio',
    textoDescripcion: 'Buscar Precio',
    rutaImagen: 'assets/images/botones_funciones/buscar-articulo.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [],
    tooltip: '',
    teclaAccesoRapido: 'F8'
  }, {
    orden: 9,
    identificador: 'cancelar',
    textoDescripcion: 'Cancelar',
    rutaImagen: 'assets/images/botones_funciones/cancelar.png',
    habilitado: false,
    visible: true,
    configuracionSubBotones: [],
    tooltip: '',
    teclaAccesoRapido: 'F9'
  }, {
    orden: 10,
    identificador: 'otrosIngresos',
    textoDescripcion: 'Otros ingresos',
    rutaImagen: 'assets/images/botones_funciones/otros-ingresos.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [{
      orden: 1,
      identificador: 'tiempoAire',
      textoDescripcion: 'Tiempo Aire',
      rutaImagen: 'assets/images/botones_funciones/tiempo-aire.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F1'
    }, {
      orden: 2,
      identificador: 'pagoServicios',
      textoDescripcion: 'Pago Servicios',
      rutaImagen: 'assets/images/botones_funciones/pago_servicios.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F2'
    }, {
      orden: 3,
      identificador: 'pagoMayorista',
      textoDescripcion: 'Pago Mayoristas',
      rutaImagen: 'assets/images/botones_funciones/pago-mayoristas.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F3'
    }
    ,
    {
      orden: 4,
      identificador: 'pagoWebx',
      textoDescripcion: 'Pago Web',
      rutaImagen: 'assets/images/botones_funciones/pago-mayoristas.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F4'
    }
  ],
    tooltip: '',
    teclaAccesoRapido: 'F10'
  }, {
    orden: 11,
    identificador: 'modificarTransaccion',
    textoDescripcion: 'Modificar transacción',
    rutaImagen: 'assets/images/botones_funciones/modificar-transaccion.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [{
      orden: 1,
      identificador: 'suspenderTransaccion',
      textoDescripcion: 'Suspender transacción',
      rutaImagen: 'assets/images/botones_funciones/cancelar_transaccion.png',
      habilitado: false,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F1'
    }, {
      orden: 2,
      identificador: 'recuperarTransaccion',
      textoDescripcion: 'Recuperar transacción',
      rutaImagen: 'assets/images/botones_funciones/recuperar_transaccion.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F2'
    }, {
      orden: 3,
      identificador: 'postAnulacion',
      textoDescripcion: 'Post Anular transacción',
      rutaImagen: 'assets/images/botones_funciones/recuperar_transaccion.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F3'
    }],
    tooltip: '',
    teclaAccesoRapido: 'F11'
  }, {
    orden: 12,
    identificador: 'operacionesTarjetaMM',
    textoDescripcion: 'Operaciones TMM',
    rutaImagen: 'assets/images/botones_funciones/operaciones-tmm.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [{
      orden: 1,
      identificador: 'consultaSaldoMM',
      textoDescripcion: 'Consulta Saldo TMM',
      rutaImagen: 'assets/images/botones_funciones/consulta_saldo.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F1'
    }, {
      orden: 2,
      identificador: 'pagoTarjetaMM',
      textoDescripcion: 'Pago TMM',
      rutaImagen: 'assets/images/botones_funciones/pago-tarjet-milano.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F2'
    }],
    tooltip: '',
    teclaAccesoRapido: 'F12'
  }, {
    orden: 13,
    identificador: 'gerente',
    textoDescripcion: 'Gerente',
    rutaImagen: 'assets/images/botones_funciones/gerente.png',
    habilitado: true,
    visible: true,
    configuracionSubBotones: [{
      orden: 1,
      identificador: 'reimpresionTicket',
      textoDescripcion: 'Reimpresión Ticket',
      rutaImagen: 'assets/images/botones_funciones/reimprimir-ticket.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F1'
    }, {
      orden: 2,
      identificador: 'retiroEfectivo',
      textoDescripcion: 'Retiro  Parcial de Efectivo',
      rutaImagen: 'assets/images/botones_funciones/retiro_efectivo.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F2'
    }, {
      orden: 3,
      identificador: 'cambiarPassword',
      textoDescripcion: 'Cambiar Password',
      rutaImagen: 'assets/images/botones_funciones/lectura_x.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F3'
    }, {
      orden: 4,
      identificador: 'egresos',
      textoDescripcion: 'Egresos',
      rutaImagen: 'assets/images/botones_funciones/retiro_efectivo.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F4'
    }, {
      orden: 5,
      identificador: 'lecturaZ',
      textoDescripcion: 'Lectura Z',
      rutaImagen: 'assets/images/botones_funciones/lectura_y.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F5'
    }, {
      orden: 6,
      identificador: 'cashBack',
      textoDescripcion: 'Cash Back Advanced',
      rutaImagen: 'assets/images/botones_funciones/retiro_efectivo.png',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F6'
    }],
    tooltip: '',
    teclaAccesoRapido: ''
  }, {
    orden: 14,
    identificador: 'cambiarPrecioArticulo',
    textoDescripcion: 'Cambio de Precio',
    rutaImagen: 'assets/images/botones_funciones/efectivo.png',
    habilitado: false,
    visible: true,
    configuracionSubBotones: [],
    tooltip: '',
    teclaAccesoRapido: ''
  }, {
    orden: 15,
    identificador: 'descuentos',
    textoDescripcion: 'Descuentos',
    rutaImagen: 'fa fa-percent',
    habilitado: false,
    visible: true,
    configuracionSubBotones: [{
      orden: 1,
      identificador: 'descuentoPorcentaje',
      textoDescripcion: 'Descuento Porcentaje',
      rutaImagen: 'fa fa-percent',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F1'
    }, {
      orden: 2,
      identificador: 'descuentoImporte',
      textoDescripcion: 'Descuento Importe',
      rutaImagen: 'fa fa-money-bill-alt',
      habilitado: true,
      visible: true,
      configuracionSubBotones: [],
      tooltip: '',
      teclaAccesoRapido: 'F2'
    }],
    tooltip: '',
    teclaAccesoRapido: ''
  }
];

import { PagoEfectivoComponent } from './pago-efectivo/pago-efectivo.component';
import { ModalOptions } from 'ngx-bootstrap/modal';
import {PagosOps, TipoCabeceraTotalizar, TipoPago, TipoPagoAccesoBoton, TipoVenta} from '../../shared/GLOBAL';
import { PagoTarjetaCreditoDebitoComponent } from './pago-tarjeta-credito-debito/pago-tarjeta-credito-debito.component';
import { PagoTarjetaCreditoDebito2Component } from './pago-tarjeta-credito-debito2/pago-tarjeta-credito-debito2.component';
import { PagoTarjetaAmericanExpressComponent } from './pago-tarjeta-american-express/pago-tarjeta-american-express.component';
import { PagoTarjetaRegaloComponent } from './pago-tarjeta-regalo/pago-tarjeta-regalo.component';
import { PagoFinanciamientoMayoristaComponent } from './pago-financiamiento-mayorista/pago-financiamiento-mayorista.component';
import { PagoFinanciamientoEmpleadoComponent } from './pago-financiamiento-empleado/pago-financiamiento-empleado.component';
import { PagoValesComponent } from './pago-vales/pago-vales.component';
import { PagoMonedaExtranjeraComponent } from './pago-moneda-extranjera/pago-moneda-extranjera.component';
import { PagoTarjetaMmComponent } from './pago-tarjeta-mm/pago-tarjeta-mm.component';
import {NotasDeCreditoComponent} from './notas-de-credito/notas-de-credito.component';
import {FinLagComponent} from './fin-lag/fin-lag.component';
import { RedencionDeCuponesComponent } from './redencion-de-cupones/redencion-de-cupones.component';
import {PinPadMovilComponent} from './pin-pad-movil/pin-pad-movil.component';
import {PagoTransferenciaComponent} from './pago-transferencia/pago-transferencia.component';
import { RedencionPuntosLealtadComponent } from './redencion-puntos-lealtad/redencion-puntos-lealtad.component';



export const BtnEfectivo = {
  name: PagosOps.efectivo,
  tipoPago: TipoPagoAccesoBoton.efectivo,
  tecla: 'F1',
  imagen: 'assets/images/botones_formas_pago/efectivo.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(PagoEfectivoComponent, options);
  }
};

export const BtnTarjetaMM = {
  name: PagosOps.tarjetaMM,
  tipoPago: TipoPagoAccesoBoton.tarjetaMM,
  tecla: 'F2',
  imagen: 'assets/images/botones_formas_pago/tarjeta-milano.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(PagoTarjetaMmComponent, options);
  }
};

export const BtnCreditoDebito = {
  name: PagosOps.tarjetaCreditoDebit,
  tipoPago: TipoPagoAccesoBoton.tarjetaCreditoDebit,
  tecla: 'F3',
  imagen: 'assets/images/botones_formas_pago/tarjeta.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(PagoTarjetaCreditoDebitoComponent, options);
  }
};

export const BtnCreditoDebito2 = {
  name: PagosOps.tarjetaCreditoDebit2,
  tipoPago: TipoPagoAccesoBoton.tarjetaCreditoDebit2,
  tecla: 'F3',
  imagen: 'assets/images/botones_formas_pago/tarjeta2.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(PagoTarjetaCreditoDebito2Component, options);
  }
};

// RHA: 11/06/2023
// Configuración para llamar al componente para la redención de puntos de lealtad
export const BtnPagoLealtad = {
  name: PagosOps.pagoLealtad,
  tipoPago: TipoPagoAccesoBoton.pagoLealtad,
  tecla: 'F15',
  imagen: 'assets/images/botones_formas_pago/lealtad.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState: {
        formasPagoMenu: this,
        ticketVirtualInstance: this.ticketVirtualInstance
      }
    };
    this.modalRef = this.modalService.show(RedencionPuntosLealtadComponent, options);
  }
};


export const BtnAmericanExpress = {
  name: PagosOps.americanExpress,
  tipoPago: TipoPagoAccesoBoton.americanExpress,
  tecla: 'F5',
  imagen: 'assets/images/botones_formas_pago/tarjeta.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(PagoTarjetaAmericanExpressComponent, options);

  }
};

export const BtnTransferenciaBancaria = {
  name: PagosOps.transferencia,
  tipoPago: TipoPagoAccesoBoton.transferencia,
  tecla: '',
  imagen: 'assets/images/botones_formas_pago/transferencia.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this
      }
    };

    this.modalRef = this.modalService.show(PagoTransferenciaComponent, options);
  }
}

export const BtnPinPadMovil = {
  name: PagosOps.pinpadMov,
  tipoPago: TipoPagoAccesoBoton.pinpadMov,
  tecla: 'F12',
  imagen: 'assets/images/botones_formas_pago/tarjeta.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(PinPadMovilComponent, options);
  }
};

export const BtnTarjetaRegalo = {
  name: PagosOps.tarjetaRegalo,
  tipoPago: TipoPagoAccesoBoton.tarjetaRegalo,
  tecla: 'F6',
  imagen: 'assets/images/botones_formas_pago/tarjeta-regalo.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(PagoTarjetaRegaloComponent, options);
  }
};

export const BtnFinanciamiento = {
  name: PagosOps.financiamento,
  tipoPago: TipoPagoAccesoBoton.financiamento,
  tecla: 'F7',
  imagen: 'assets/images/botones_formas_pago/financiamiento.png',
  clase: 'bg-purple',
  enabled: false,
  visible: true,
  default: {
    enabled: false,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: '',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this,
        TipoVenta: TipoVenta.VentaMayorista
      }
    };

    if (this.currentTipoVenta === TipoVenta.VentaMayorista ||
      this.currentMayorista) {
      options.class = 'modal-lg';
      this.modalRef = this.modalService.show(PagoFinanciamientoMayoristaComponent, options);
    } else {
      this.modalRef = this.modalService.show(PagoFinanciamientoEmpleadoComponent, options);
    }
  }
};

export const BtnVales = {
  name: PagosOps.vales,
  tipoPago: TipoPagoAccesoBoton.vales,
  tecla: 'F8',
  imagen: 'assets/images/botones_formas_pago/vales.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(PagoValesComponent, options);
  }
};

export const BtnMonedaExtranjera = {
  name: PagosOps.monedaExtranjera,
  tipoPago: TipoPagoAccesoBoton.monedaExtranjera,
  tecla: 'F9',
  imagen: 'assets/images/botones_formas_pago/vales.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(PagoMonedaExtranjeraComponent, options);
  }
};

export const BtnNotasDeCredito = {
  name: PagosOps.notaCredito,
  tipoPago: TipoPagoAccesoBoton.notaCredito,
  tecla: 'F10',
  imagen: 'assets/images/botones_formas_pago/vales.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(NotasDeCreditoComponent, options);
  }
};

export const BtnFiLag = {
  name: PagosOps.finLag,
  tipoPago: TipoPagoAccesoBoton.finLag,
  tecla: '',
  imagen: 'assets/images/botones_formas_pago/vales.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(FinLagComponent, options);
  }
};

export const BtnRedencionCupones = {
  name: PagosOps.cupones,
  tipoPago: TipoPagoAccesoBoton.cupones,
  tecla: 'F11',
  imagen: 'assets/images/botones_formas_pago/vales.png',
  clase: 'bg-purple',
  enabled: true,
  visible: true,
  default: {
    enabled: true,
    visible: true
  },
  handler: function (conf) {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      initialState: {
        formasPagoMenu: this
      }
    };
    this.modalRef = this.modalService.show(RedencionDeCuponesComponent, options);
  }
};





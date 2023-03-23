import { BusquedaEmpleadoComponent } from '../busqueda-empleado/busqueda-empleado.component';
import { PagoDeServiciosComponent } from '../pago-de-servicios/pago-de-servicios.component';
import { DescuentoRequest } from '../../Models/Sales/Descuento.model';
import { DescuentosComponent } from '../descuentos/descuentos.component';
import { BusquedaTransaccionComponent } from '../busqueda-transaccion/busqueda-transaccion.component';
import { VentaTiempoAireComponent } from '../venta-tiempo-aire/venta-tiempo-aire.component';
import { CambiarPasswordComponent } from '../cambiar-password/cambiar-password.component';
import { BusquedaApartadoComponent } from '../busqueda-apartado/busqueda-apartado.component';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { PagoMayoristaComponent } from '../pago-mayorista/pago-mayorista.component';
import { SudoCallbackFactory } from '../../Models/General/SudoCallbackFactory';
import { BusquedaAvanzadaComponent } from '../busqueda-avanzada/busqueda-avanzada.component';
import { ConsultaSaldoTMMComponent } from '../consulta-saldo-TMM/consulta-saldo-TMM.component';
import { SuperUsuarioComponent } from '../super-usuario/super-usuario.component';
import { BusquedaClienteComponent } from '../busqueda-cliente/busqueda-cliente.component';
import { PagoTcmmComponent } from '../pago-tcmm/pago-tcmm.component';
import { TipoApartado, TipoDescuento, TipoReporte } from '../../shared/GLOBAL';
import { DescuentosMercanciaComponent } from '../descuentos-mercancia/descuentos-mercancia.component';
import { DescuentosTransaccionComponent } from '../descuentos-transaccion/descuentos-transaccion.component';
import { ReportesComponent } from '../reportes/reportes.component';
import { LecturaZComponent } from '../lectura-z/lectura-z.component';
import {CapturaLuzComponent} from '../captura-luz/captura-luz.component';
import {ReporteApartadosComponent} from '../reporteApartados/reporteApartados.component';
import {RelacionCajaReporteComponent} from '../relacion-caja-reporte/relacion-caja-reporte.component';
import { PagoWebxComponent } from '../pago-webx/pago-webx.component';
import { TicketVirtualBuscarLealtadComponent } from '../ticket-virtual-buscar-lealtad/ticket-virtual-buscar-lealtad.component';

export const FuncionesBtnHandler = {
  ventaRegular(conf) {
    this._router.navigate(['/POS']).then();
  },
  ventaEmpleado(conf) {
    this._router.navigate(['/POS/EMPLEADO']).then(
    );
  },
  ventaMayoristas(conf) {
    this._router.navigate(['/POS/MAYORISTA']).then(
    );
  },
  // busquedaLealtad(conf) {
  //   this._router.navigate(['/POS/LEALTAD']).then(
  //   );
  // },
  // busquedaLealtad(conf) {
  //   if (!this.modalRef) {
  //     // OCG: Si no se pasa la instancia, no se recibe en el modal
  //     const initialState = {ticketVirtualInstance: this.ticketVirtualInstance};
  //     this.modalRef = this.modalService.show(TicketVirtualBuscarLealtadComponent, {backdrop: 'static',initialState});
  //   }
  // },
  busquedaLealtad(conf) {
    const initialState = {ticketVirtualInstance: this.ticketVirtualInstance};
    // const options: ModalOptions = {
    //   class: 'modal-lg',
    //   backdrop: 'static',
    //   initialState
    // };
    this.modalRef = this.modalService.show(TicketVirtualBuscarLealtadComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState
    });
  },
  showChilds(conf) {
    this.showChild(conf);
  },
  creacionApartado(conf) {
    if (!this.modalRef) {
      const initialState = {ticketVirtualInstance: this.ticketVirtualInstance};
      this.modalRef = this.modalService.show(BusquedaClienteComponent, {class: 'modal-lg', initialState});
    }
  },
  abonoApartado(conf) {
    if (!this.modalRef) {
      const options: ModalOptions = {
        class: 'modal-max',
        backdrop: 'static'
      };
      this.modalRef = this.modalService.show(BusquedaApartadoComponent, options);
      this._dataTransfer.$tipoApartado.next(TipoApartado.Abono);
    }
  },

  cancelacionApartado(conf) {
    if (!this.modalRef) {
      const options: ModalOptions = {
        class: 'modal-max',
        backdrop: 'static'
      };
      this.modalRef = this.modalService.show(BusquedaApartadoComponent, options);
      this._dataTransfer.$tipoApartado.next(TipoApartado.Cancelacion);
    }
  },
  devoluciones(conf) {
    this._router.navigate(['/POS/DEVOLUCION']);
  },
  totalizarVenta(conf) {
    this._dataTransfer.$ticketVirtualTotaliza.next(true);
  },
  buscarVendedor(conf) {
    if (!this.modalRef) {
      const options: ModalOptions = {
        class: 'modal-lg',
        backdrop: 'static'
      };
      this.modalRef = this.modalService.show(BusquedaAvanzadaComponent, options);
    }
  },
  buscarPrecio(conf) {
    const options: ModalOptions = {
      class: 'modal-lg',
      backdrop: 'static'
    };
    this.modalRef = this.modalService.show(BusquedaAvanzadaComponent, options);
  },
  cancelar(conf) {
    this.ticketVirtualInstance.cancelarTicket();
  },
  tiempoAire(conf) {
    if (!this.modalRef) {
      this.modalRef = this.modalService.show(VentaTiempoAireComponent, {backdrop: 'static'});
    }
  },
  pagoServicios(conf) {
    if (!this.modalRef) {
      this.modalRef = this.modalService.show(PagoDeServiciosComponent, {backdrop: 'static'});
    }
  },
  pagoMayorista(conf) {
     if (!this.modalRef) {
      const initialState = {ticketVirtualInstance: this.ticketVirtualInstance};
      this.modalRef = this.modalService.show(PagoMayoristaComponent, {class: 'modal-lg', initialState});
    }
  },
  pagoWebx(conf) {
    if (!this.modalRef) {
      // OCG: Si no se pasa la instancia, no se recibe en el modal
      const initialState = {ticketVirtualInstance: this.ticketVirtualInstance};
      this.modalRef = this.modalService.show(PagoWebxComponent, {backdrop: 'static',initialState});
    }
  },
  suspenderTransaccion(conf) {
    this._dataTransfer.$suspenderTransaccion.next(true);
  },
  recuperarTransaccion(conf) {
    const initialState = {ticketVirtualInstance: this.ticketVirtualInstance};
    if (!this.modalRef) {
      this.modalRef = this.modalService.show(BusquedaTransaccionComponent, {backdrop: 'static', class: 'modal-lg', initialState});
    }
  },
  postAnulacion(conf) {
    return new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'sudoPostAnulacion',
      modalService: this.modalService
    });
  },
  consultaSaldoMM(conf) {
    if (!this.modalRef) {
      this.modalRef = this.modalService.show(ConsultaSaldoTMMComponent, {backdrop: 'static'});
    }
  },
  pagoTarjetaMM(conf) {
    const initialState = {ticketVirtualInstance: this.ticketVirtualInstance};
    if (!this.modalRef) {
      this.modalRef = this.modalService.show(PagoTcmmComponent, {backdrop: 'static', initialState});
    }
  },
  showChildsSudo(conf) {

    const factory = new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'showChild',
      callbackParams: [conf],
      modalService: this.modalService
    });

  },
  reimpresionTicket(conf) {
    return new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'sudoReimpresionTicket',
      modalService: this.modalService
    });
  },
  retiroEfectivo(conf) {
    return new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'sudoRetiroEfectivo',
      modalService: this.modalService
    });
  },
  cambiarPassword(conf) {
    if (!this.modalRef) {
      const options: ModalOptions = {
        class: 'modal-md',
        backdrop: 'static'
      };
      this.modalRef = this.modalService.show(CambiarPasswordComponent, options);
    }
  },
  egresos(conf) {
    return new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'sudoEgresos',
      modalService: this.modalService
    });
  },
  cashBack(conf) {
    return new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'sudoCashBack',
      modalService: this.modalService
    });
  },
  lecturaZ(conf) {
    if (!this.modalRef) {
      this.modalRef = this.modalService.show(LecturaZComponent, {backdrop: 'static', keyboard: false, 'class': 'modal-dialogCenter'});
    }
  },
  lecturaX(conf) {
    return new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'sudoLecturaX',
      modalService: this.modalService
    });
  },
  cambiarPrecioArticulo(conf) {
    if (!this.modalRef && this.ticketVirtualInstance.getSeletedItem()) {
      this.ticketVirtualInstance.sudoCambiarPrecioArticulo();
    } else if (!this.ticketVirtualInstance.getSeletedItem()) {
      this._alertService.show({
        titulo: 'Milano', mensaje: 'Para continuar es necesario seleccionar un art\u00EDculo en el ticket de venta.', tipo: 'info'
      });
    }
  },
  descuentos(conf) {
    const factory = new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'showChild',
      callbackParams: [conf]
    });
    const initialState = factory.getInitialState();
    this.modalRef = this.modalService.show(SuperUsuarioComponent, {class: 'modal-sm', initialState});
    this.modalRef.content.action.take(1).subscribe(
      factory.callBackFn()
    );

  },
  descuentoPorcentaje(conf) {
    if (!this.modalRef && this.ticketVirtualInstance.getSeletedItem()) {

      const rowItem = new DescuentoRequest();

      rowItem.itemPrice = this.ticketVirtualInstance.getSeletedItem().rowTotal;
      rowItem.rowIndex = this.ticketVirtualInstance.currentSelection;
      rowItem.sku = this.ticketVirtualInstance.getSeletedItem().sku;

      const initialState = {tipoDescuento: TipoDescuento.porcentaje, rowItem: rowItem};
      this.modalRef = this.modalService.show(DescuentosComponent, Object.assign({}, {}, {class: 'modal-sm', initialState}));
    } else if (!this.ticketVirtualInstance.getSeletedItem()) {
      this._alertService.show({
        titulo: 'Milano', mensaje: 'Para continuar es necesario seleccionar un art\u00EDculo en el ticket de venta.', tipo: 'info'
      });
    }
  },
  descuentoImporte(conf) {
    if (!this.modalRef && this.ticketVirtualInstance.getSeletedItem()) {
      const rowItem = new DescuentoRequest();

      rowItem.itemPrice = this.ticketVirtualInstance.getSeletedItem().rowTotal;
      rowItem.rowIndex = this.ticketVirtualInstance.currentSelection;
      rowItem.sku = this.ticketVirtualInstance.getSeletedItem().sku;

      const initialState = {tipoDescuento: TipoDescuento.importe, rowItem: rowItem};
      this.modalRef = this.modalService.show(DescuentosComponent, Object.assign({}, {}, {class: 'modal-sm', initialState}));
    } else if (!this.ticketVirtualInstance.getSeletedItem()) {
      this._alertService.show({
        titulo: 'Milano', mensaje: 'Para continuar es necesario seleccionar un art\u00EDculo en el ticket de venta.', tipo: 'info'
      });
    }
  },
  descuentoTransaccionPorcentaje(conf) {
    if (!this.modalRef && this.ticketVirtualInstance.getSeletedItem()) {

      let rowItems: Array<DescuentoRequest> = [];

      rowItems = this.ticketVirtualInstance.ticketVirtual.getRowsDiscountTransaction().map(
        ticketRow => new DescuentoRequest({
          itemPrice: ticketRow.rowTotal,
          rowIndex: ticketRow.arrayPosition,
          sku: ticketRow.sku
        })
      );

      const initialState = {tipoDescuento: TipoDescuento.porcentaje, rowItem: rowItems};
      this.modalRef = this.modalService.show(DescuentosTransaccionComponent, Object.assign({}, {}, {initialState}));

    } else if (!this.ticketVirtualInstance.getSeletedItem()) {
      this._alertService.show({
        titulo: 'Milano', mensaje: 'Para continuar es necesario seleccionar una l\u00EDnea en el ticket de venta, apartir de la cual se realizar\u00E1 el descuento.', tipo: 'info'
      });
    }
  },
  descuentoTransaccionImporte(conf) {
    if (!this.modalRef && this.ticketVirtualInstance.getSeletedItem()) {

      let rowItems: Array<DescuentoRequest> = [];

      rowItems = this.ticketVirtualInstance.ticketVirtual.getRowsDiscountTransaction().map(
        ticketRow => new DescuentoRequest({
          itemPrice: ticketRow.rowTotal,
          rowIndex: ticketRow.arrayPosition,
          sku: ticketRow.sku
        })
      );


      const initialState = {tipoDescuento: TipoDescuento.importe, rowItem: rowItems};
      this.modalRef = this.modalService.show(DescuentosTransaccionComponent, Object.assign({}, {}, {initialState}));

    } else if (!this.ticketVirtualInstance.getSeletedItem()) {
      this._alertService.show({
        titulo: 'Milano', mensaje: 'Para continuar es necesario seleccionar una l\u00EDnea en el ticket de venta, apartir de la cual se realizar\u00E1 el descuento.', tipo: 'info'
      });
    }
  },
  reporteVentasDepartamento(conf) {
    if (!this.modalRef) {

      const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta, TipoReporte: TipoReporte.departamento};
      this.modalRef = this.modalService.show(ReportesComponent, Object.assign({}, {}, {class: 'modal-lg', initialState}));

    }
  },
  reporteVentasSku(conf) {
    if (!this.modalRef) {

      const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta, TipoReporte: TipoReporte.sku};
      this.modalRef = this.modalService.show(ReportesComponent, Object.assign({}, {}, {class: 'modal-lg', initialState}));

    }
  },
  reporteVentasHr(conf) {
    if (!this.modalRef) {

      const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta, TipoReporte: TipoReporte.hr};
      this.modalRef = this.modalService.show(ReportesComponent, Object.assign({}, {}, {class: 'modal-lg', initialState}));

    }
  },
  reporteApartadosDetalle(conf) {
    if (!this.modalRef) {

      const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta, TipoReporte: TipoReporte.detalle};
      this.modalRef = this.modalService.show(ReporteApartadosComponent, Object.assign({}, {}, {class: 'modal-lg', initialState}));

    }
  },
  reporteApartadosSinDetalle(conf) {
    if (!this.modalRef) {

      const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta, TipoReporte: TipoReporte.sinDetalle};
      this.modalRef = this.modalService.show(ReportesComponent, Object.assign({}, {}, {class: 'modal-lg', initialState}));

    }
  },
  reporteVentasCaja(conf) {
    if (!this.modalRef) {

      const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta, TipoReporte: TipoReporte.caja};
      this.modalRef = this.modalService.show(ReportesComponent, Object.assign({}, {}, {class: 'modal-lg', initialState}));

    }
  },
  reporteVentasVendedor(conf) {
    if (!this.modalRef) {

      const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta, TipoReporte: TipoReporte.vendedor};
      this.modalRef = this.modalService.show(ReportesComponent, Object.assign({}, {}, {class: 'modal-lg', initialState}));

    }
  },
  reporteDevolucionesSku(conf) {
    if (!this.modalRef) {

      const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta, TipoReporte: TipoReporte.devoluciones};
      this.modalRef = this.modalService.show(ReportesComponent, Object.assign({}, {}, {class: 'modal-lg', initialState}));

    }
  },
  reporteIngresosEgresos(conf) {
    if (!this.modalRef) {

      const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta, TipoReporte: TipoReporte.ingEgresos};
      this.modalRef = this.modalService.show(ReportesComponent, Object.assign({}, {}, {class: 'modal-lg', initialState}));

    }
  },
  reporteRelacionCaja(conf) {
    if (!this.modalRef) {

      this.modalRef = this.modalService.show(RelacionCajaReporteComponent, Object.assign({}, {}, {class: 'modal-lg'}));

    }
  },
  mercanciaDanada() {
    if (!this.modalRef  && this.ticketVirtualInstance.getSeletedItem()) {
      const rowItem = new DescuentoRequest();

      rowItem.itemPrice = this.ticketVirtualInstance.getSeletedItem().rowTotal;
      rowItem.rowIndex = this.ticketVirtualInstance.currentSelection;
      rowItem.sku = this.ticketVirtualInstance.getSeletedItem().sku;
      const cantidad = this.ticketVirtualInstance.getSeletedItem().lineaTicket.cantidadVendida;

      const initialState = {tipoDescuento: TipoDescuento.danada, rowItem: rowItem, cantidad: cantidad};
      this.modalRef = this.modalService.show(DescuentosMercanciaComponent, Object.assign({}, {}, {class: 'modal-sm', initialState}));
    } else if (!this.ticketVirtualInstance.getSeletedItem()) {
      this._alertService.show({
        titulo: 'Milano', mensaje: 'Para continuar es necesario seleccionar un art\u00EDculo en el ticket de venta.', tipo: 'info'
      });
    }
  },
  picosMercancia() {
    if (!this.modalRef  && this.ticketVirtualInstance.getSeletedItem()) {
      const rowItem = new DescuentoRequest();

      rowItem.itemPrice = this.ticketVirtualInstance.getSeletedItem().rowTotal;
      rowItem.rowIndex = this.ticketVirtualInstance.currentSelection;
      rowItem.sku = this.ticketVirtualInstance.getSeletedItem().sku;
      const cantidad = this.ticketVirtualInstance.getSeletedItem().lineaTicket.cantidadVendida;

      const initialState = {tipoDescuento: TipoDescuento.picos, rowItem: rowItem, cantidad: cantidad};
      this.modalRef = this.modalService.show(DescuentosMercanciaComponent, Object.assign({}, {}, {class: 'modal-sm', initialState}));
    } else if (!this.ticketVirtualInstance.getSeletedItem()) {
      this._alertService.show({
        titulo: 'Milano', mensaje: 'Para continuar es necesario seleccionar un art\u00EDculo en el ticket de venta.', tipo: 'info'
      });
    }
  },
  cargaLlaves() {
    if (!this.modalRef) {
      this.sudoCargaLlaves();
    }
  },
  botonInicioDia() {
    if (!this.modalRef) {
      this.inicioDia();
    }
  },
  botonFinDia () {
    if (!this.modalRef) {
      this.finDia();
    }
  },
  pageControl: null,
  chilsControl: null
};

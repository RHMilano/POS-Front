import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { AlertService } from '../../../services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  altaClienteFinalRequest,
  busquedaClienteFinalRequest,
  busquedaClienteFinalResponse
} from '../../../Models/Sales/ClienteFinalMayorista';
import { SalesService } from '../../../services/sales.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsDatepickerConfig, BsLocaleService} from 'ngx-bootstrap';
import {
  EntidadesFederativas,
  EstadosPago,
  FlujoBloqueo,
  PagosOps,
  TipoPago,
  TipoPagoAccesoBoton,
  TipoVenta
} from '../../../shared/GLOBAL';
import { ProcesarMovimientoMayoristaRequest } from '../../../Models/Sales/ProcesarMovimientoMayorista';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { PagosMasterService } from '../../../services/pagos-master.service';
import { NgForm } from '@angular/forms';
import { Decimal } from 'decimal.js/decimal';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import { DescuentoPromocionalLineaModel } from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import { DescuentoPromocionalVentaModel } from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import { DescuentoPromocionalAplicado } from '../../../Models/Sales/DescuentoPromocionalAplicado';
import { ModalFocusDirective } from '../../../directives/modal-focus.directive';
import { RowSelectorConfig } from '../../../Models/FrontEnd/RowSelectorInterface';
import { RowSelector } from '../../../Models/FrontEnd/RowSelector';
import { FocusTicketRowDirective } from '../../../directives/focus-ticket-row.directive';
import {ConfigPosService} from "../../../services/config-pos.service";
import {DosDecimalesPipe} from '../../../pipes/dos-decimales.pipe';

@Component({
  selector: 'app-pago-financiamiento-mayorista',
  templateUrl: './pago-financiamiento-mayorista.component.html',
  styleUrls: ['./pago-financiamiento-mayorista.component.css'],
  providers: [SalesService, DosDecimalesPipe]
})
export class PagoFinanciamientoMayoristaComponent implements OnInit, RowSelectorConfig {
  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  @Input() TipoVenta: TipoVenta;
  tipoPago = TipoPagoAccesoBoton.financiamento;
  recibido: number;
  totalToPay = 0;
  montoCreditoFinanciamiento = 0;
  mayoristaVale: number;
  searchClienteFinalRequest: busquedaClienteFinalRequest;
  clientesFinales: Array<busquedaClienteFinalResponse>;
  clientesFinalesP: number;
  selectedClienteFinal: busquedaClienteFinalResponse;
  clienteFinalCrear: altaClienteFinalRequest = new altaClienteFinalRequest();
  showBusquedaCliente = false;
  modalCliente: BsModalRef;
  bsConfig: Partial<BsDatepickerConfig>;
  activarBusqueda: boolean;
  optionsEstados = Object.keys(EntidadesFederativas).map(key => EntidadesFederativas[key]);
  @ViewChild('templateCrearClienteFinal') templateCrearClienteFinal: TemplateRef<any>;
  @ViewChild('busquedaForm') busquedaForm: NgForm;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;
  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;

  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  totalAplicandoPromociones: Decimal;
  fechaHoy: Date;

  itemsPerPage = 5;
  rowSelector: RowSelector;
  totalItemsToPaginate: number;


  constructor(private modalService: BsModalService, private alertService: AlertService, private _salesService: SalesService
    , private _localeService: BsLocaleService,  private _pagosMaster: PagosMasterService,
              public _configService: ConfigPosService, private dosDecimales: DosDecimalesPipe) {
    this._localeService.use('es');
    this.fechaHoy = new Date();
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      maxDate: this.fechaHoy
    });
  }

  ngOnInit() {
    this.totalToPay = Number(this._pagosMaster.PagosMaster.totales.totalAbono || this._pagosMaster.PagosMaster.totales.totalTicketLast);
    this.recibido = this.dosDecimales.calc(this.totalToPay);

    this.montoCreditoFinanciamiento = Number(this.formasPagoMenu.currentMayorista.creditoDisponible);
    this.searchClienteFinalRequest = new busquedaClienteFinalRequest();
    this.searchClienteFinalRequest.apellidos = '';
    this.searchClienteFinalRequest.nombres = '';
    this.searchClienteFinalRequest.rfc = '';
    this.searchClienteFinalRequest.ine = '';
    this.searchClienteFinalRequest.codigoClienteFinal = null;
    this.searchClienteFinalRequest.codigoMayorista = null;


    this.busquedaForm.valueChanges.subscribe((value: any) => {
        for (const valueKey in value) {
          if (value.hasOwnProperty(valueKey)) {
            this.activarBusqueda = !!value[valueKey] && !!value[valueKey].toString().trim();
            if (this.activarBusqueda) {
              break;
            }
          }
        }
      }
    );
    this._configService.applyColor(this.TipoVenta);
  }

  cancelPay() {
    this.modalService._hideModal(1);
  }

  validatePay() {
    const recibido = Number(this.recibido || 0);

    return recibido > this.totalToPay || (recibido === 0 || this.montoCreditoFinanciamiento == null);
  }

  closeModal() {
    this.formasPagoMenu.closeModal();
  }

  addPay() {


    if(!this.mayoristaVale)
    {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Debe capturar el número de vale'});
      return;
    }

    if (!this.searchClienteFinalRequest.ine) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Debe capturar el INE'});
      return;
    }

    if (!this.searchClienteFinalRequest.codigoClienteFinal) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Debe capturar el número de cliente final'});
      return;
    }

    if (!this.searchClienteFinalRequest.rfc) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Debe capturar el RFC'});
      return;
    }

    if (!this.searchClienteFinalRequest.apellidos) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Debe capturar los apellidos del cliente final'});
      return;
    }

    if (!this.searchClienteFinalRequest.nombres) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Debe capturar los nombres del cliente final'});
      return;
    }

    if (!this.recibido) {
      this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto'});
      return;
    } else {
      if (Number(this.recibido) === 0 || Number(this.recibido) <= 0) {
        this.alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Ingrese una cantidad mayor a 0'});
        return;
      } else {
        const recibido = Number(this.recibido);
        const mayoristaRequ = new ProcesarMovimientoMayoristaRequest();
        mayoristaRequ.codigoMayorista = this.formasPagoMenu.currentMayorista.codigoMayorista;
        mayoristaRequ.codigoClienteFinal = this.selectedClienteFinal.codigoClienteFinal;
        mayoristaRequ.nombreClienteFinal = this.selectedClienteFinal.nombres + ' ' + this.selectedClienteFinal.apellidos;
        mayoristaRequ.numeroVale = this.mayoristaVale;
        mayoristaRequ.codigoFormaPagoImporte = TipoPago.financiamento;
        mayoristaRequ.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
        mayoristaRequ.montoFinanciado = recibido;
        mayoristaRequ.importeVentaTotal = this.formasPagoMenu.currentTotalizarInfo.pagoInfo.total;
        mayoristaRequ.estatus = EstadosPago.Registrado;
        mayoristaRequ.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
        mayoristaRequ.descuentosPromocionalesPorVentaAplicados = {descuentoPromocionesAplicados: []};
        mayoristaRequ.descuentosPromocionalesPorLineaAplicados = {descuentoPromocionesAplicados: []};

        if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones && this.totalAplicandoPromociones.comparedTo(mayoristaRequ.montoFinanciado) <= 0) {

          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
          this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);

          mayoristaRequ.descuentosPromocionalesPorVentaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
              return descuentoAplicado;
            })
          };

          mayoristaRequ.descuentosPromocionalesPorLineaAplicados = {
            descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
              descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
              return descuentoAplicado;
            })
          };
        }

        this._salesService.procesarMovimientoMayorista(mayoristaRequ).subscribe(resp => {
          if (resp.codeNumber.toString() === '1') {
            const pago = new FormaPagoUtilizado();
            pago.estatus = EstadosPago.Registrado;
            pago.codigoFormaPagoImporte = TipoPago.financiamento;
            pago.importeMonedaNacional = recibido;
            pago.secuenciaFormaPagoImporte = mayoristaRequ.secuenciaFormaPagoImporte;
            pago.descuentosPromocionalesPorVentaAplicados = {descuentoPromocionesAplicados: []};
            pago.descuentosPromocionalesPorLineaAplicados = {descuentoPromocionesAplicados: []};

            if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones.comparedTo(mayoristaRequ.montoFinanciado) <= 0) {

              pago.descuentosPromocionalesPorVentaAplicados = {
                descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
                  descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
                  return descuentoAplicado;
                })
              };

              pago.descuentosPromocionalesPorLineaAplicados = {
                descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
                  descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.financiamento;
                  return descuentoAplicado;
                })
              };
            }

            const pagoDisplay = new PagosToDisplay({
              nombre: PagosOps.financiamientoMayorista,
              cantidad: pago.importeMonedaNacional,
              clave: TipoPago.financiamientoMayorista,
              formaDePago: pago
            });

            this._pagosMaster.addPago(pagoDisplay);
            this.formasPagoMenu.pagoFinanciamientoAgregado = true;
            this.formasPagoMenu.bloqueaBtn(FlujoBloqueo.financiamientoAgregado);
            this.closeModal();
          } else {
            this.alertService.show({mensaje: resp.codeDescription, tipo: 'error', titulo: 'milano'});
          }
        });
      }
    }
  }

  // OCG: Limpiar los datos de la informacion de busqueda
  // previamente capturada
  resetForm(){
    this.searchClienteFinalRequest.apellidos = '';
    this.searchClienteFinalRequest.nombres = '';
    this.searchClienteFinalRequest.rfc = '';
    this.searchClienteFinalRequest.ine = '';
    this.searchClienteFinalRequest.codigoClienteFinal = null;
    this.mayoristaVale = null;
  }

  searchClienteFinal() {
    let pet = new busquedaClienteFinalRequest();
    pet = Object.assign({}, this.searchClienteFinalRequest);

    pet.codigoMayorista = pet.codigoMayorista || 0;
    pet.codigoClienteFinal = pet.codigoClienteFinal || 0;

    if (pet.rfc || pet.ine || pet.codigoClienteFinal) {
      this._salesService.busquedaClienteFinal(pet).subscribe(resp => {
        if (resp.length) {


          this.totalItemsToPaginate = resp.length;
          this.rowSelector = new RowSelector(this);
          this.clientesFinales = resp;
          this.showBusquedaCliente = true;

          setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);


        } else {
          this.alertService.show({mensaje: 'No existen clientes con los datos capturados', tipo: 'error', titulo: 'Milano'});
        }
        setTimeout(() => this.modalFocusReference.getElements(), 0);
      });
    } else {
      const nombre = pet.nombres, apellido = pet.apellidos;
      if ((!!nombre || !!apellido) && (!!nombre.trim() && !!apellido.trim())) {
        this._salesService.busquedaClienteFinal(pet).subscribe(resp => {
          if (resp.length) {

            this.totalItemsToPaginate = resp.length;
            this.rowSelector = new RowSelector(this);
            this.clientesFinales = resp;
            this.showBusquedaCliente = true;

            setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);
          } else {
            this.alertService.show({mensaje: 'No existen clientes con los datos capturados', tipo: 'error', titulo: 'Milano'});
          }
          setTimeout(() => this.modalFocusReference.getElements(), 0);
        });
      } else {
        this.alertService.show({mensaje: 'Introduce Nombres y Apellidos', tipo: 'warning', titulo: 'Milano'});
      }
    }
  }

  setSelectedItem(clienteParam: busquedaClienteFinalResponse, index: any): any {

    const cliente = clienteParam || this.clientesFinales[index];

    this.searchClienteFinalRequest.codigoClienteFinal = cliente.codigoClienteFinal;
    this.searchClienteFinalRequest.ine = cliente.ine;
    this.searchClienteFinalRequest.rfc = cliente.rfc;
    this.searchClienteFinalRequest.nombres = cliente.nombres;
    this.searchClienteFinalRequest.apellidos = cliente.apellidos;
    this.selectedClienteFinal = cliente;

  }

  selectClienteFinal(cliente: busquedaClienteFinalResponse, index) {

    this.rowSelector.currentSelection = index;
    this.setSelectedItem(cliente, null);
    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);

  }

  onRowEnterAction() {
    this.showBusquedaCliente = false;
  }

  cancelCrearCliente() {
    this.clienteFinalCrear = new altaClienteFinalRequest();
    this.modalCliente.hide();
  }

  openCrearClienteFinal() {
    //this.clienteFinalCrear.sexo = 'M';

    this.modalFocusReference.toggleElements('true');

    this.modalCliente = this.modalService.show(this.templateCrearClienteFinal, {
      class: 'modal-lg',
      backdrop: 'static'
    });

    this.modalService.onHidden.take(1).subscribe(() => {
      setTimeout(() => {
        this.modalFocusReference.toggleElements('false');
      }, 0);
    });

  }

  crearClienteFinal() {


    this.clienteFinalCrear.fechaNacimiento = moment(new Date(this.clienteFinalCrear.fechaNacimientoField)).format('DD/MM/YYYY');
    this.clienteFinalCrear.codigoMayorista = this.formasPagoMenu.currentMayorista.codigoMayorista;

    this._salesService.altaClienteFinal(this.clienteFinalCrear).subscribe(resp => {
      if (resp.error === '') {
        const clienteFinal = new busquedaClienteFinalResponse();

        clienteFinal.codigoClienteFinal = resp.codigoClienteFinal;
        clienteFinal.apellidos = resp.apellidos;
        clienteFinal.codigoMayorista = resp.codigoMayorista;
        clienteFinal.fechaNacimiento = resp.fechaNacimiento;
        clienteFinal.ine = resp.ine;
        clienteFinal.nombres = resp.nombres;
        clienteFinal.rfc = resp.rfc;
        clienteFinal.apellidos = resp.apellidos;
        clienteFinal.sexo = resp.sexo;
        clienteFinal.telefono = resp.telefono;
        clienteFinal.mensaje = resp.mensaje;

        this.searchClienteFinalRequest.codigoClienteFinal = resp.codigoClienteFinal;
        this.searchClienteFinalRequest.ine = resp.ine;
        this.searchClienteFinalRequest.rfc = resp.rfc;
        this.searchClienteFinalRequest.nombres = resp.nombres;
        this.searchClienteFinalRequest.apellidos = resp.apellidos;


        this.selectedClienteFinal = clienteFinal;
        this.cancelCrearCliente();

      } else {
        this.alertService.show({mensaje: resp.error, tipo: 'error', titulo: 'Milano'});
      }
    });

  }

  getPromocionesPosibles(promociones: {
    promocionesPosiblesAplicablesLinea: Array<DescuentoPromocionalLineaModel>,
    promocionesPosiblesAplicablesVenta: Array<DescuentoPromocionalVentaModel>,
    descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>,
    descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>,
    totalAplicandoPromociones: Decimal
  }) {

    this.promocionesPosiblesLinea = promociones.promocionesPosiblesAplicablesLinea;
    this.promocionesPosiblesVenta = promociones.promocionesPosiblesAplicablesVenta;
    this.descuentosPromocionalesAplicadosLinea = promociones.descuentosPromocionalesAplicadosLinea;
    this.descuentosPromocionalesAplicadosVenta = promociones.descuentosPromocionalesAplicadosVenta;
    this.totalAplicandoPromociones = promociones.totalAplicandoPromociones;

  }
}

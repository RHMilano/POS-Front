import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {BsDatepickerConfig, BsLocaleService, BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {SalesService} from '../../../../services/sales.service';
import {ModalFocusDirective} from '../../../../directives/modal-focus.directive';
import {FocusTicketRowDirective} from '../../../../directives/focus-ticket-row.directive';
import {ClienteResponseModel} from '../../../../Models/Sales/ClienteResponse.model';
import {ClienteRequest} from '../../../../Models/Sales/ClienteRequest';
import {EntidadesFederativas} from '../../../../shared/GLOBAL';
import {RowSelector} from '../../../../Models/FrontEnd/RowSelector';
import {AlertService} from '../../../../services/alert.service';
import {FormasPagoMenuComponentInterface} from '../../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import {ValidaValeResponse} from '../../../../Models/Pagos/ValidaValeResponse';
import {PagoFinLagComponent} from '../pago-fin-lag/pago-fin-lag.component';
import {ConsultaClienteFinLag} from '../../../../Models/Pagos/ConsultaClienteFinLag';
import {TablaAmortizacionResponse} from '../../../../Models/Pagos/TablaAmortizacionResponse';
import {TablaAmortizacionRequest} from '../../../../Models/Pagos/TablaAmortizacionRequest';
import {ValidaValeRequest} from '../../../../Models/Pagos/ValidaValeRequest';
import {isDate} from 'ngx-bootstrap/chronos/utils/type-checks';

@Component({
  selector: 'app-busqueda-cliente-finLag',
  templateUrl: './busqueda-cliente-finLag.component.html',
  styleUrls: ['./busqueda-cliente-finLag.component.css'],
  providers: [SalesService]
})
export class BusquedaClienteFinLagComponent implements OnInit {

  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  @Input() valeInfo: ValidaValeResponse;
  @Input() vale: ValidaValeRequest;
  @Input() recibido: number;
  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;


  fechaNacimiento: Date;
  bsConfig: Partial<BsDatepickerConfig>;
  editandoCliente: boolean;
  nombreClienteBusqueda: string;
  apellidoPatClienteBusqueda: string;
  apellidoMatClienteBusqueda: string;
  tituloVentana: string;
  optionsEstados = Object.keys(EntidadesFederativas).map(key => EntidadesFederativas[key] = key.toUpperCase());
  estatusCliente: boolean;
  masculino: boolean;
  femenino: boolean;
  disabledSelect: boolean;


  constructor(public _bsModalRef: BsModalRef, private _salesService: SalesService, private _alertService: AlertService,
              private _localeService: BsLocaleService, public modalService: BsModalService) {
    this._localeService.use('es');
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY', showWeekNumbers : false });
  }

  ngOnInit() {
    this.estatusCliente = this.valeInfo.estatusCliente ? true : false;
    this.tituloVentana = 'Búsqueda de Cliente';
    this.editandoCliente = false;
    this.disabledSelect = true;
  }


  validarBusqueda() {
    if (!this.nombreClienteBusqueda || !this.apellidoPatClienteBusqueda || !this.apellidoMatClienteBusqueda || !this.fechaNacimiento) {
      return false;
    } else {
      return true;
    }
  }

  aceptarBusqueda() {
    this.estatusCliente = true;
    const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
     const clienteRequest = new ConsultaClienteFinLag();
     clienteRequest.nombre = this.nombreClienteBusqueda;
     clienteRequest.aPaterno = this.apellidoPatClienteBusqueda;
     clienteRequest.aMaterno = this.apellidoMatClienteBusqueda;
     clienteRequest.fechaNacimiento = this.fechaNacimiento.toLocaleDateString('es-ES', options);
     this._salesService.consultaClienteFinLagService(clienteRequest).subscribe( resp => {
       if(Number(resp.NumeroCodigo) === 100) {
          this.tituloVentana = 'Validar Cliente';
            this.valeInfo.nombre = resp.nombre;
            this.valeInfo.materno = resp.aMaterno;
            this.valeInfo.paterno = resp.aPaterno;
            this.valeInfo.municipio = resp.municipio;
            this.valeInfo.ine = resp.iNE;
            this.valeInfo.calle = resp.calle;
            this.valeInfo.colonia = resp.colonia;
            this.valeInfo.estado = resp.estado.toUpperCase();
            this.valeInfo.sexo = resp.sexo;
            this.valeInfo.fechaNacimiento = resp.fechaNacimiento;
            this.valeInfo.numero = resp.numExt;
            this.valeInfo.cP = resp.cP;
            this.valeInfo.estatusCliente = resp.estatusCliente;
            this.masculino = resp.sexo.toUpperCase() == 'MASCULINO' ? true: false;
            this.femenino = resp.sexo.toUpperCase() == 'FEMENINO' ? true: false;
        } else{
          this.tituloVentana = 'Captura Información Cliente';
          this.valeInfo.nombre = this.nombreClienteBusqueda;
          this.valeInfo.paterno = this.apellidoPatClienteBusqueda;
          this.valeInfo.materno = this.apellidoMatClienteBusqueda;
          this.valeInfo.fechaNacimiento = this.fechaNacimiento;
          this._alertService.show({mensaje: resp.DescripcionCodigo, tipo: 'error', titulo: 'Milano'});
        }
     });
  }

  validaCliente() {
    if(this.valeInfo.nombre && this.valeInfo.paterno && this.valeInfo.materno && this.valeInfo.fechaNacimiento &&
      this.valeInfo.ine && this.valeInfo.calle && this.valeInfo.numero && this.valeInfo.colonia && this.valeInfo.municipio
      && this.valeInfo.estado && this.valeInfo.cP && (this.masculino || this.femenino)) {
      return true;
    } else {
      return false;
    }
  }

  cancelPay() {
    this.closeModal();
    this.formasPagoMenu.selectOperation('reset');
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  seleccionar() {
    this.closeModal();
    const initialState = {formasPagoMenu: this.formasPagoMenu};
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState: {
        formasPagoMenu: this.formasPagoMenu,
        valeInfo: this.valeInfo,
        vale: this.vale
      }
    };
    this._bsModalRef = this.modalService.show(PagoFinLagComponent, options);
  }

  setSelect(val) {
    this.disabledSelect = val;
  }

  aceptarBusquedaTablaAmor() {
    if (this.masculino) {
      this.valeInfo.sexo = 'MASCULINO';
    } else {
      this.valeInfo.sexo = 'FEMENINO';
    }
    const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
    const tablaRequest = new TablaAmortizacionRequest();
    if(this.valeInfo.idDistribuidora && Number(this.valeInfo.idDistribuidora) !== 0) {
      tablaRequest.idDistribuidora = Number(this.valeInfo.idDistribuidora);
    } else {
      tablaRequest.idDistribuidora = this.vale.idDistribuidora ? this.vale.idDistribuidora : 0;
    }
    tablaRequest.folioVale = this.vale.folioVale;
    tablaRequest.montoVenta = this.recibido;
    tablaRequest.nombre = this.valeInfo.nombre;
    tablaRequest.aPaterno = this.valeInfo.paterno;
    tablaRequest.aMaterno = this.valeInfo.materno;
    tablaRequest.calle = this.valeInfo.calle;
    tablaRequest.fechaNacimiento = !isDate(this.valeInfo.fechaNacimiento) ? this.valeInfo.fechaNacimiento:
      this.valeInfo.fechaNacimiento.toLocaleDateString('es-ES', options);
    tablaRequest.numExt = this.valeInfo.numero;
    tablaRequest.colonia = this.valeInfo.colonia;
    tablaRequest.cP = this.valeInfo.cP;
    tablaRequest.municipio = this.valeInfo.municipio;
    tablaRequest.estado = this.valeInfo.estado;
    /*tablaRequest.sexo = this.valeInfo.sexo;
    tablaRequest.ine = this.valeInfo.ine; Aun no los implementan los de finlag*/
    this._salesService.tablaAmortizacionService(tablaRequest).subscribe( resp => {
      if (resp.length && Number(resp[0].NumeroCodigo) === 4 || Number(resp[0].NumeroCodigo) === 28 || Number(resp[0].NumeroCodigo) === 46
        || Number(resp[0].NumeroCodigo) === 49 || Number(resp[0].NumeroCodigo) === 52) {
        this.closeModal();
        const initialState = {formasPagoMenu: this.formasPagoMenu};
        const options: ModalOptions = {
          class: 'modal-lg',
          backdrop: 'static',
          keyboard: false,
          initialState: {
            formasPagoMenu: this.formasPagoMenu,
            valeInfo: this.valeInfo,
            vale: this.vale,
            recibido: this.recibido,
            pagos: resp
          }
        };
        this._bsModalRef = this.modalService.show(PagoFinLagComponent, options);
      } else {
        this._alertService.show({mensaje: resp[0].DescripcionCodigo , tipo: 'error', titulo: 'Milano'});
        this.cancelPay();
      }
    });
  }
}


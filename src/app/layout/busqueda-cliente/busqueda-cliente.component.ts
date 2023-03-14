import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ClienteRequest } from '../../Models/Sales/ClienteRequest';
import { SalesService } from '../../services/sales.service';
import { AlertService } from '../../services/alert.service';
import { ClienteResponseModel } from '../../Models/Sales/ClienteResponse.model';
import { ClienteModificaRequest } from '../../Models/Sales/ClienteModificaRequest';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { RowSelector } from '../../Models/FrontEnd/RowSelector';
import { RowSelectorConfig } from '../../Models/FrontEnd/RowSelectorInterface';
import { FocusTicketRowDirective } from '../../directives/focus-ticket-row.directive';
import { ModalFocusDirective } from '../../directives/modal-focus.directive';
import {EntidadesFederativas} from "../../shared/GLOBAL";

@Component({
  selector: 'app-busqueda-cliente',
  templateUrl: './busqueda-cliente.component.html',
  styleUrls: ['./busqueda-cliente.component.css'],
  providers: [SalesService]
})
export class BusquedaClienteComponent implements OnInit, RowSelectorConfig {

  @Input() ticketVirtualInstance: TicketVirtualComponentInterface;
  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;


  busquedaCliente: FormGroup;
  clientesBusqueda: Array<ClienteResponseModel> = [];
  nuevoCliente: FormGroup;
  busquedaClienteRequest: ClienteRequest;
  modoInformacionCliente: boolean;
  editandoCliente: boolean;
  nombreClienteBusqueda: string;
  codigoClienteBusqueda: number;
  telefonoClienteBusqueda: string;
  tituloVentana: string;
  clienteSeleccionado: ClienteResponseModel;
  optionsEstados = Object.keys(EntidadesFederativas).map(key => EntidadesFederativas[key]);
  estado;
  totalItemsToPaginate: number;
  itemsPerPage = 5;
  rowSelector: RowSelector;

  constructor(public _bsModalRef: BsModalRef, private _salesService: SalesService, private _alertService: AlertService) {
  }

  ngOnInit() {

    this.tituloVentana = 'Búsqueda de Cliente';
    this.editandoCliente = false;

    this.busquedaCliente = new FormGroup({
      nombreClienteBusqueda: new FormControl(''),
      codigoClienteBusqueda: new FormControl('', Validators.pattern(/^[0-9]/)),
      telefonoClienteBusqueda: new FormControl('', Validators.pattern(/^[0-9]/))
    }, (c: FormGroup): ValidationErrors => {
      let alMenosUnoFlag = false;
      for (const obj in c.controls) {
        if (c.controls.hasOwnProperty(obj) && c.get(obj).value) {
          alMenosUnoFlag = alMenosUnoFlag || !!c.get(obj).value.replace(/ /g, '');
        }
      }
      if (!alMenosUnoFlag) {
        return {
          alMenosUno: {
            valid: false
          }
        };
      } else {
        return null;
      }
    });

    this.nuevoCliente = new FormGroup({
      telefono: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      apellidoPaterno: new FormControl('', Validators.required),
      apellidoMaterno: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.email])),
      estado: new FormControl('', Validators.required),
      ciudad: new FormControl('', Validators.required),
      codigoPostal: new FormControl('', Validators.required),
      calle: new FormControl('', Validators.required),
      noExterior: new FormControl('', Validators.required),
      noInterior: new FormControl('', Validators.required),
      codigoCliente: new FormControl(''),
      codigoTienda: new FormControl(''),
      codigoCaja: new FormControl('')
    });

  }

  cancelar() {
    if (this.modoInformacionCliente) {
      this.nuevoCliente.reset();
      this.modoInformacionCliente = false;
      this.editandoCliente = false;
      this.tituloVentana = 'Búsqueda de Cliente';
    } else {
      this._bsModalRef.hide();
    }
  }

  aceptarBusqueda() {
    this.busquedaClienteRequest = new ClienteRequest({
      nombre: this.nombreClienteBusqueda,
      telefono: this.telefonoClienteBusqueda,
      codigoCliente: this.codigoClienteBusqueda
    });

    this._salesService.ClienteService(this.busquedaClienteRequest).subscribe(
      response => {
        if (response.length) {

          this.totalItemsToPaginate = response.length;
          this.rowSelector = new RowSelector(this);
          this.clientesBusqueda = response;

          setTimeout(() => this.modalFocusReference.getElements(), 0);
          setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);



        } else {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Cliente no encontrado.'});
        }
      }
    );
  }


  onEditarCliente(cliente: ClienteResponseModel) {
    this.tituloVentana = `Editar Cliente - ${cliente.nombre} ${cliente.apellidoPaterno}`;
    this.editandoCliente = true;
  }

  onNuevoCliente() {
    this.nuevoCliente.reset();
    this.modoInformacionCliente = true;
    this.nuevoCliente.get('codigoCliente').setValue(0);
    this.tituloVentana = `Agregar Cliente Nuevo`;
    this.nuevoCliente.enable();
    this.editandoCliente = true;
  }

  aceptarClienteSeleccionado() {
    this.ticketVirtualInstance.setClienteApartado(this.clienteSeleccionado);
    this._bsModalRef.hide();
  }

  aceptarCliente() {
    this.ticketVirtualInstance.setClienteApartado(this.nuevoCliente.getRawValue());
    this._bsModalRef.hide();
  }

  guardarInfoCliente() {
    const guardarRequest = new ClienteModificaRequest(
      this.nuevoCliente.getRawValue()
    );

    this._salesService.ClienteModificaService(guardarRequest).subscribe(resp => {
      if (resp.codeNumber.toString() === '338' || resp.codeNumber.toString() === '339') {
        const clienteInfo: ClienteResponseModel = this.nuevoCliente.getRawValue();
        clienteInfo.codigoCliente = resp.codigoCliente;
        this.ticketVirtualInstance.setClienteApartado(clienteInfo);
        this._alertService.show({mensaje: resp.codeDescription, tipo: 'success', titulo: 'Milano'});
        this._bsModalRef.hide();
      } else if (resp.codeNumber.toString() === '355') {
        this._alertService.show({mensaje: resp.codeDescription, tipo: 'warning', titulo: 'Milano'});
      }
    });
  }


  seleccionarCliente(cliente: ClienteResponseModel, index: number) {
    this.rowSelector.currentSelection = index;
    this.setSelectedItem(cliente, null);
    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);

  }


  setSelectedItem(clienteParam: ClienteResponseModel, index: number) {

    const cliente = clienteParam || this.clientesBusqueda[index];

    if (!cliente.telefono.replace(/ /g, '')) {
      this._alertService.show({
        tipo: 'error', titulo: 'Milano', mensaje: 'Cliente no cuenta con número telefónico. Actualice la información.'
      });

      this.onEditarCliente(cliente);
      this.modoInformacionCliente = true;

    } else {

      this.nuevoCliente.disable();
      this.editandoCliente = false;
      this.modoInformacionCliente = false;
      this.clienteSeleccionado = cliente;
    }

    this.nuevoCliente.setValue(cliente);

  }

}


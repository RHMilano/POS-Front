import { Component, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MsgService } from '../../services/msg.service';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs/Subscription';
import { DataTransferService } from '../../services/data-transfer.service';
import { SalesService } from '../../services/sales.service';
import { Router } from '@angular/router';
import { BusquedaTransaccionResponse } from '../../Models/Sales/BusquedaTransaccionResponse';
import { BusquedaTransaccionRequest } from '../../Models/Sales/BusquedaTransaccionRequest';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { EstatusTransaccion } from '../../shared/GLOBAL';
import { CargaVentaResponseService } from '../../services/carga-venta-response.service';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import {RowSelector} from "../../Models/FrontEnd/RowSelector";
import {FocusTicketRowDirective} from "../../directives/focus-ticket-row.directive";
import {ModalFocusDirective} from "../../directives/modal-focus.directive";


@Component({
  selector: 'app-busqueda-transaccion',
  templateUrl: './busqueda-transaccion.component.html',
  styleUrls: ['./busqueda-transaccion.component.css'],
  providers: [SalesService]
})

export class BusquedaTransaccionComponent implements OnInit, OnDestroy {

  @ViewChild('cancelTemplate') cancelTemplate: TemplateRef<any>;
  @Input() ticketVirtualInstance: TicketVirtualComponentInterface;

  bsConfig: Partial<BsDatepickerConfig>;
  modalSubscriptions: Subscription[] = [];
  _modalRef: BsModalRef;
  selectedRow: number;
  transacciones: BusquedaTransaccionResponse[];
  Folio: string;
  seleccionado: BusquedaTransaccionResponse;
  isBuscando: boolean;
  transaccion;
  folioOperacion: number;
  itemsPerPage = 5;
  rowSelector: RowSelector;
  totalItemsToPaginate: number;

  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;

  constructor(public modalRef: BsModalRef, private _msg: MsgService,
              public _dataTransfer: DataTransferService, private _router: Router,
              private _alertService: AlertService, private modalService: BsModalService,
              private serviceTransaccion: SalesService, private _localeService: BsLocaleService, private _cargaVentaService: CargaVentaResponseService) {
    this._localeService.use('es');
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-red',
      dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false
    });
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.seleccionado) {
      this.confirmaTransaccion();
    }
  }

  ngOnInit() {

    this.modalSubscriptions.push(this.modalService.onHidden.subscribe(($event: any, reason: string) => {
      this._modalRef = null;
    }));
    this.transacciones = [];
  }

  ngOnDestroy(): void {
    this.modalSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  /**Método para cerrar el diálogo de tiempo aire*/
  closeModal() {
    this.modalRef.hide();
  }

  /**Métod que llama al servicio para buscar transaccion */
  
  buscarTransaccion() {
    //debugger;
    if (this.Folio && !this.isBuscando) {
      const busquedaTransaccionRequest = new BusquedaTransaccionRequest();
      this.transacciones = [];
      busquedaTransaccionRequest.fechaInicial = '';
      busquedaTransaccionRequest.fechaFinal = '';
      busquedaTransaccionRequest.folioOperacion = this.Folio;
      busquedaTransaccionRequest.estatus = EstatusTransaccion.Suspendida;

      this.isBuscando = true;
      this.serviceTransaccion.BusquedaTransaccionService(busquedaTransaccionRequest).subscribe(
        data => {
          if (data.length) {
            data.forEach(index => {
              this.transacciones.push(index);
              this.transacciones.sort(function (a, b) {
                if (a.folioOperacion > b.folioOperacion) {
                  return -1;
                }
                if (a.folioOperacion < b.folioOperacion) {
                  return 1;
                }
              });
            });

            this.totalItemsToPaginate = this.transacciones.length;
            this.rowSelector = new RowSelector(this);

            setTimeout(() => this.modalFocusReference.getElements(), 0);
            setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);

            this.isBuscando = false;
          } else {
            this.isBuscando = false;
            this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'No se encontraron transacciones con los datos capturados'});
          }
        }
      );
    }
  }

  /**Método para guardar el transaccion seleccionada */
  seleccionar(transaccion: BusquedaTransaccionResponse, index: number) {
    this.seleccionado = transaccion;
    this.selectedRow = index;
    this.rowSelector.currentSelection = index;
    this.setSelectedItem(transaccion, null);
    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
  }

  setSelectedItem(transaccion, index: any): any {
    this.seleccionado = transaccion;
    this.transaccion = transaccion || this.transacciones[index];
    this.selectedRow = index;
    this.folioOperacion = this.transaccion.folioOperacion;

    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);


  }

  // Corrección: 1.2.4
  // OCG: La modificación a este proceso es para que pueda recuperar la transacción cuando
  // fue pausada previamente
  confirmaTransaccion() {
    /**Recuperar transacción */
    //alert('confirmaTransaccion');

    try {
      this.serviceTransaccion.getVentaService(this.transaccion.folioOperacion).subscribe(
        response => {

          //OCG: alert(JSON.stringify(response));
          //debugger; 
          //if (Number(response.operationResponse.codeNumber) === 100) {
            this.ticketVirtualInstance.cargaVentaResponse(response);
            this._cargaVentaService.ventaResponse = response;
            this.closeModal();
          // } else {
          //   this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: 'Mamucas'});
          // }
        }
      );
    } catch (error) {
      this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: error});
    }


  }
}

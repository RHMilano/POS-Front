import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, HostListener, Input } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions, DateFormatter, BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap';
import { MsgService } from '../../services/msg.service';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs/Subscription';
import { DataTransferService } from '../../services/data-transfer.service';
import { SalesService } from '../../services/sales.service';
import { Router } from '@angular/router';
import { PostAnularVentaRequest } from '../../Models/Sales/PostAnularVentaRequest';
import { BusquedaTransaccionResponse } from '../../Models/Sales/BusquedaTransaccionResponse';
import { BusquedaTransaccionRequest } from '../../Models/Sales/BusquedaTransaccionRequest';
import { RazonesCancelacionComponent } from '../razones-cancelacion/razones-cancelacion.component';
import { EstatusTransaccion, TipoApartado, TipoVenta } from '../../shared/GLOBAL';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import { ConfigPosService } from '../../services/config-pos.service';
import { RowSelector } from "../../Models/FrontEnd/RowSelector";
import { ModalFocusDirective } from "../../directives/modal-focus.directive";
import { FocusTicketRowDirective } from "../../directives/focus-ticket-row.directive";
import { RowSelectorConfig } from "../../Models/FrontEnd/RowSelectorInterface";


@Component({
  selector: 'app-post-anulacion',
  templateUrl: './post-anulacion.component.html',
  styleUrls: ['./post-anulacion.component.css'],
  providers: [SalesService]
})

export class PostAnulacionComponent implements OnInit, OnDestroy, RowSelectorConfig {

  @ViewChild('anularTemplate') anularTemplate: TemplateRef<any>;
  @Input() TipoVenta: TipoVenta;
  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;

  modalSubscriptions: Subscription[] = [];
  _modalRef: BsModalRef;
  selectedRow;
  FechaInicio: Date;
  FechaFin: Date;
  Folio: string;
  folioOperacion: number;
  transaccion;
  transacciones: BusquedaTransaccionResponse[];
  bsConfig: Partial<BsDatepickerConfig>;
  seleccionado: BusquedaTransaccionResponse;
  fechaHoy: Date;
  itemsPerPage = 5;
  rowSelector: RowSelector;
  totalItemsToPaginate: number;

  constructor(public modalRef: BsModalRef, private _msg: MsgService,
    public _dataTransfer: DataTransferService, private _router: Router,
    private _alertService: AlertService, private modalService: BsModalService,
    private serviceTransaccion: SalesService, private _localeService: BsLocaleService,
    public _configService: ConfigPosService) {
    this._localeService.use('es');
    this.fechaHoy = new Date();
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false, minDate: this.fechaHoy, maxDate: this.fechaHoy
    });
  }

  ngOnInit() {
    this.modalSubscriptions.push(this.modalService.onHidden.subscribe(($event: any, reason: string) => {
      this._modalRef = null;
    }));
    this.transacciones = [];
    this._configService.applyColor(this.TipoVenta);
  }

  ngOnDestroy(): void {
    this.modalSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  /**Método para cerrar el diálogo de transacciones*/
  closeModal() {
    this.modalRef.hide();
  }
  /**Métod que llama al servicio para buscar transaccion */
  buscarTransaccion() {
    this.transacciones = [];
    if (this.Folio || this.fechaHoy) {

      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      if (this.FechaInicio) {
        if (this.FechaInicio.toLocaleDateString('es-ES', options) !== this.fechaHoy.toLocaleDateString('es-ES', options)) {
          this._alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Las fecha capturada debe ser igual al día de hoy' });
          return;
        } else {
          const busquedaTransaccionRequest = new BusquedaTransaccionRequest();

          busquedaTransaccionRequest.fechaInicial = this.FechaInicio ? this.FechaInicio.toLocaleDateString('es-ES', options) : '';
          busquedaTransaccionRequest.fechaFinal = this.FechaFin ? this.FechaFin.toLocaleDateString('es-ES', options) : '';
          busquedaTransaccionRequest.folioOperacion = this.Folio ? this.Folio : '0';
          busquedaTransaccionRequest.estatus = EstatusTransaccion.Finalizada;

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
              } else {
                this._alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'No se encontraron transacciones con los datos capturados' });
              }
            }
          );
        }
      } else {
        const busquedaTransaccionRequest = new BusquedaTransaccionRequest();

        busquedaTransaccionRequest.fechaInicial = this.fechaHoy ? this.fechaHoy.toLocaleDateString('es-ES', options) : '';
        busquedaTransaccionRequest.fechaFinal = this.fechaHoy ? this.fechaHoy.toLocaleDateString('es-ES', options) : '';
        busquedaTransaccionRequest.folioOperacion = this.Folio ? this.Folio : '0';
        busquedaTransaccionRequest.estatus = EstatusTransaccion.Finalizada;

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

            } else {
              this._alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'No se encontraron transacciones con los datos capturados' });
            }
          }
        );
      }
    }
  }

  /**Método para post-anular el transaccion seleccionada */
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

  anularTransaccion() {
    this.closeModal();
    this.modalRef = this.modalService.show(this.anularTemplate, { 'class': 'modal-dialogCenter' });
  }

  confirmAnularTransaccion() {
    this.closeModal();
    const postAnularRequest = new PostAnularVentaRequest();
    postAnularRequest.folioVenta = this.transaccion.folioOperacion;
    this.modalService.show(RazonesCancelacionComponent);
    this._dataTransfer.$postanularTransaccionData.next(postAnularRequest);
  }
}

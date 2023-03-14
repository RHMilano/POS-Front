import {Component, HostListener, OnInit, Input, ViewChild} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {GeneralService} from '../../services/general.service';
import {AlertService} from '../../services/alert.service';
import {EstatusTransaccion, TipoVenta} from '../../shared/GLOBAL';
import {BusquedaTransaccionRequest} from '../../Models/Sales/BusquedaTransaccionRequest';
import {SalesService} from '../../services/sales.service';
import {BusquedaTransaccionResponse} from '../../Models/Sales/BusquedaTransaccionResponse';
import {BsLocaleService} from 'ngx-bootstrap';
import { ConfigPosService } from '../../services/config-pos.service';
import {FocusTicketRowDirective} from "../../directives/focus-ticket-row.directive";
import {ModalFocusDirective} from "../../directives/modal-focus.directive";
import {RowSelector} from "../../Models/FrontEnd/RowSelector";

@Component({
  selector: 'app-reimpresion-ticket',
  templateUrl: './reimpresion-ticket.component.html',
  styleUrls: ['./reimpresion-ticket.component.css'],
  providers: [SalesService, GeneralService]
})
export class ReimpresionTicketComponent implements OnInit {

  @Input() TipoVenta: TipoVenta;
  transacciones: BusquedaTransaccionResponse[];
  FechaInicio: Date;
  FechaFin: Date;
  Folio: string;
  bsConfig: Partial<BsDatepickerConfig>;
  selectedRow;
  fechaHoy: Date;
  transaccion;
  folioOperacion: number;
  seleccionado: BusquedaTransaccionResponse;
  itemsPerPage = 5;
  rowSelector: RowSelector;
  totalItemsToPaginate: number;

  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;


  constructor(public  modalRef: BsModalRef, private serviceTransaccion: SalesService, private generalService: GeneralService,
              public _alertService: AlertService, private _localeService: BsLocaleService, public _configService: ConfigPosService) {
    this._localeService.use('es');
    this.fechaHoy = new Date();
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY', showWeekNumbers : false });
  }

  ngOnInit() {
    this.transacciones = [];
    this._configService.applyColor(this.TipoVenta);
  }

  /**Métod que llama al servicio para buscar transaccion */
  buscarTransaccion() {
    if (this.Folio || this.fechaHoy) {
      const busquedaTransaccionRequest = new BusquedaTransaccionRequest();

      const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
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
            this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'No se encontraron transacciones con los datos capturados'});
          }
        }
      );
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  /**Método guardar transaccion seleccionada */
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

  printTicket() {
    if (this.Folio ||  this.fechaHoy) {
      this.generalService.printTicket(this.transaccion.folioOperacion).subscribe(
        data => {
          if (Number(data.codeNumber) === 100) {
            this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Se ha impreso el ticket correctamente'});
            this.closeModal();
          } else {
            this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: 'Error de impresión ' + data.codeDescription});
          }
        }
      );
    }
  }
}

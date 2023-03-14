import { Component, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Employee, EmployeeRequest, EmployeeResponse } from '../../Models/Sales/Employee';
import { SalesService } from '../../services/sales.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { AlertService } from '../../services/alert.service';
import { RowSelectorConfig, RowSelectorInterface } from '../../Models/FrontEnd/RowSelectorInterface';
import { ModalFocusDirective } from '../../directives/modal-focus.directive';
import { FocusTicketRowDirective } from '../../directives/focus-ticket-row.directive';
import { RowSelector } from '../../Models/FrontEnd/RowSelector';

@Component({
  selector: 'app-busqueda-empleado',
  templateUrl: './busqueda-empleado.component.html',
  styleUrls: ['./busqueda-empleado.component.css'],
  providers: [SalesService]
})

export class BusquedaEmpleadoComponent implements OnInit, RowSelectorConfig {

  Code: number;
  Name: string;
  selectedRow: number;
  seleccionado: EmployeeResponse;
  empleados: EmployeeResponse[] = [];

  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;


  itemsPerPage = 5;
  rowSelector: RowSelectorInterface;
  totalItemsToPaginate: number;

  constructor(public  modalRef: BsModalRef, private _dataTransfer: DataTransferService,
              private employeeService: SalesService, public _alertService: AlertService) {
  }


  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.seleccionado) {
      this.finalizarbusqueda();
    }
  }

  ngOnInit() {

  }


  /**Método para cerrar el diálogo de busqueda de empleado*/
  closeModal() {
    this.modalRef.hide();
  }

  finalizarbusqueda() {
    if (this.seleccionado) {
      this._dataTransfer.$vendedorTicketVirtual.next(this.seleccionado);
      this.modalRef.hide();
    }
  }

  /**Método para cargar empleados que coincidan con la busqueda*/
  busqueda() {
    if (this.Code || this.Name) {
      const employeeRequest = new EmployeeRequest();

      employeeRequest.code = this.Code;
      employeeRequest.name = this.Name;

      if (!employeeRequest.code) {
        employeeRequest.code = 0;
      }
      if (!employeeRequest.name) {
        employeeRequest.name = '';
      }
      this.employeeService.EmployeeService(employeeRequest).subscribe(
        data => {
          if (data.length) {
            this.empleados = [];


            if (data.length === 1) {
              this.seleccionado = new Employee(data[0]);
              this.finalizarbusqueda();
              return;
            }

            this.totalItemsToPaginate = data.length;
            this.rowSelector = new RowSelector(this);

            data.forEach(index => {
              const empleado = new Employee(index);
              this.empleados.push(empleado);
            });


            setTimeout(() => this.modalFocusReference.getElements(), 0);
            setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);

          } else {
            this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Empleado no encontrado'});
            return;
          }
        }
      );
    }
  }

  /**Método para guardar el empleado seleccionado */
  seleccionar(empleado, index) {

    this.selectedRow = index;
    this.rowSelector.currentSelection = index;
    this.setSelectedItem(empleado, null);
    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
  }


  setSelectedItem(empleado: any, index: any): any {
    this.seleccionado = empleado || this.empleados[index];
    this.selectedRow = index;
  }

}

import { GetEmployeeMilanoResponseModel } from '../Sales/GetEmployeeMilanoResponse.model';
import { BsModalRef } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { SuspenderVentaRequest } from '../Sales/SuspenderVentaRequest';
import { Router } from '@angular/router';
import { VentaResponseModel } from '../Sales/VentaResponse.model';
import { TicketVirtualComponentInterface } from './TicketVirtualComponentInterface';
import { ElementRef, TemplateRef } from '@angular/core';

export interface TicketVirtualEmpleadoComponentInterface extends TicketVirtualComponentInterface {
  numeroEmpleado: number;
  employeeInfo: GetEmployeeMilanoResponseModel;
  selectedEmployee: GetEmployeeMilanoResponseModel;
  modalRefEmpleado: BsModalRef;
  subscriptions: Subscription[];
  articuloAgregadoEmpleadoSub: any;
  suspenderRequest: SuspenderVentaRequest;
  articuloAgregado: boolean;
  buscaEmplTmpl: TemplateRef<any>;
  skuInput: ElementRef;
  _router: Router;

  ngAfterViewInit(): void;

  ngOnInit(): void;

  ngOnDestroy(): void;

  cancelarVentaEmpleado(): void;

  validaDiaVenta(): void;

  seleccionarEmpleado(): void;

  empleadoOnEnter(): void;

  aceptarEmpleado(): void;

  resetTicket(): void;

  initCabeceraVenta(): void;

  suspenderModal(): void;

  suspenderTransaccion(): void;

  cargaVentaResponse(venta: VentaResponseModel): void;
}

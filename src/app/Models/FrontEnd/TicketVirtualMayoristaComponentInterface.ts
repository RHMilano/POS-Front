import { GetMayoristaMilanoResponseModel } from '../Sales/GetMayoristaMilanoResponse.model';
import { BsModalRef } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { SuspenderVentaRequest } from '../Sales/SuspenderVentaRequest';
import { ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { VentaResponseModel } from '../Sales/VentaResponse.model';
import { TicketVirtualComponentInterface } from './TicketVirtualComponentInterface';

export interface TicketVirtualMayoristaComponentInterface extends TicketVirtualComponentInterface {
  mayoristaInfo: GetMayoristaMilanoResponseModel;
  selectedMayorista: GetMayoristaMilanoResponseModel;
  modalRefMayorista: BsModalRef;
  subscriptions: Subscription[];
  articuloAgregadoMayoristaSub: any;
  suspenderRequest: SuspenderVentaRequest;
  busquedaMayoristaTmpl: TemplateRef<any>;
  skuInput: ElementRef;
  _router: Router;

  seleccionarMayorista(): void;

  resetTicket(): void;

  initCabeceraVenta(): void;

  suspenderModal(): void;

  suspenderTransaccion(): void;

  aceptarMayorista(): void;

  cargaVentaResponse(venta: VentaResponseModel): void;
}

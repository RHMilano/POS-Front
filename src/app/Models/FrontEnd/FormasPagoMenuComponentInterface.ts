import { ShowPagosRequest } from '../Pagos/Pagos.model';
import { TicketVirtualComponentInterface } from './TicketVirtualComponentInterface';
import { TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FlujoBloqueo, OrigenPago, PagosOps, TipoPagoAccesoBoton, TipoVenta } from '../../shared/GLOBAL';
import { ConfigGeneralesCajaTiendaResponse } from '../General/ConfigGeneralesCajaTiendaResponse.model';
import { GetEmployeeMilanoResponseModel } from '../Sales/GetEmployeeMilanoResponse.model';
import { GetMayoristaMilanoResponseModel } from '../Sales/GetMayoristaMilanoResponse.model';
import { DataTransferService } from '../../services/data-transfer.service';
import { SalesService } from '../../services/sales.service';
import { ConfigPosService } from '../../services/config-pos.service';
import { GeneralService } from '../../services/general.service';
import { Router } from '@angular/router';
import { PagosMasterService } from '../../services/pagos-master.service';

export interface FormasPagoMenuComponentInterface {
  currentTotalizarInfo: ShowPagosRequest;
  ticketVirtualInstance: TicketVirtualComponentInterface;
  cashBackTemplate: TemplateRef<any>;
  pagosToRender: any[];
  showingChilds: boolean;
  modalRef: BsModalRef;
  botonesSub: any;
  inEnd: boolean;
  currentPage: number;
  itemsPerPage: number;
  origenPago: OrigenPago;
  secuencia: number;
  currentConfig: ConfigGeneralesCajaTiendaResponse;
  currentEmployee: GetEmployeeMilanoResponseModel;
  currentMayorista: GetMayoristaMilanoResponseModel;
  currentTipoVenta: TipoVenta;
  aceptarFinanciamiento: boolean;
  pagoFinanciamientoAgregado: boolean;
  pagosList: Array<{
    name: PagosOps,
    tipoPago: TipoPagoAccesoBoton,
    tecla: string,
    imagen: string,
    clase: string,
    enabled: boolean,
    visible: boolean,
    default: {
      enabled: boolean,
      visible: boolean
    },
    handler: (conf: any) => void
  }>,
  modalService: BsModalService;
  _dataTransfer: DataTransferService;
  _salesService: SalesService;
  _configService: ConfigPosService;
  generalService: GeneralService;
  _router: Router;
  _pagosMaster: PagosMasterService;

  centroPagosRule(): void;

  closeModal(): void;

  cancelPay(): void;

  bloqueaBtn(flujoBloqueo: FlujoBloqueo): void;

  showItems(page: number): void;

  selectOption(item: any): void;

  selectOperation(tipo: any): void;

  blockPagos(): void;

}

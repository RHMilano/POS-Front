import { TicketRow } from '../../layout/ticket-virtual/TicketRow';
import { ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { TicketVirtualComponentInterface } from './TicketVirtualComponentInterface';
import { LineaTicket } from '../Sales/LineaTicket';
import { BsModalService } from 'ngx-bootstrap';
import { SudoCallbackFactory } from '../General/SudoCallbackFactory';

export interface ArticuloComponentInterface {
  ticketRow: TicketRow;
  index: number;
  currentSelection: number;
  selectedItem: EventEmitter<any>;
  articuloInstance: EventEmitter<any>;
  ticketVirtual: TicketVirtualComponentInterface;
  currentQty: number;
  articuloRow: ElementRef;
  articuloQty: ElementRef;
  showCantidadControl: boolean;
  showRemoveTarjetaRegalo: boolean;
  disableDevolucion: boolean;
  cantidadNueva: number;
  lineaTicket: LineaTicket;
  cantidadAnterior: number;
  keyboardUnListener: () => void;
  _modalService: BsModalService;
  _renderer: Renderer2;

  setClickedRow(index): void;

  setFocusOnQty(): void;

  removeOneProduct(): void;

  removeLineaProduct(): void;

  addOneProduct(): void;

  updateQty(value?: any): SudoCallbackFactory;

  pedirRazonDevolicion(): void;

  updateLineaTicket(): void;

  resetTotalizarTicket(): void;

  rollbackEliminar(): void;

  setRazonDevolucion(codigoRazon: number): void;
}

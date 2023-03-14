import { EventEmitter, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LineaPago } from '../../layout/formas-de-pago/LineaPago';
import { ApartadoResponseModel } from '../Apartados/ApartadoResponse.model';
import { FinalizarVentaRequest } from '../Sales/FinalizarVentaRequest';
import { AbonarApartadoRequest } from '../Apartados/AbonarApartadoRequest';
import { PlazosApartadoResponse } from '../Apartados/PlazosApartadoResponse';
import { PagosToDisplayModel } from '../Pagos/PagosToDisplay.model';
import { TotalesLast } from '../Pagos/TotalesLast';
import { InformacionAsociadaRetiroEfectivo } from '../General/InformacionAsociadaRetiroEfectivo';
import { DataTransferService } from '../../services/data-transfer.service';
import { Router } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { AlertService } from '../../services/alert.service';
import { ConfigPosService } from '../../services/config-pos.service';
import { PagosMasterService } from '../../services/pagos-master.service';
import { GeneralService } from '../../services/general.service';
import { PagosMaster } from '../Pagos/PagosMaster';
import { FormaPagoUtilizado } from '../Pagos/FormaPagoUtilizado';

export interface FormasDePagoComponentInterface {
  ticketVirtual: any;
  plazoTemplate: TemplateRef<any>;
  finalizarTemplate: TemplateRef<any>;
  retiroEfectivo: TemplateRef<any>;
  cancelarSub: any;
  BotonPago: string;
  BotonCancelar: string;
  modalRef: BsModalRef;
  pagos: Array<LineaPago>;
  pagosBack: any[];
  cliente: string;
  pagoApartado: ApartadoResponseModel;
  finalizarVentaRequest: FinalizarVentaRequest;
  crearApartadoRequest: any;
  apartadoRequest: AbonarApartadoRequest;
  pagoFinanciamiento: boolean;
  porcentajeApartado: number;
  montoApartado: number;
  validacionApartado: boolean;
  tipoA: boolean;
  tipoNA: boolean;
  VentaRegular: boolean;
  SelectPlazo: any;
  secuencia: number;
  totalVenta: any;
  totalVentaRequest: any;
  count: number;
  Cantidad: number;
  plazos: Array<PlazosApartadoResponse>;
  montoPago: number;
  pago: PagosToDisplayModel;
  totalesLast: TotalesLast;
  totalToPaidMonedaExtranjera: any;
  pagoRestanteAbono: number;
  selectP: any;
  numeroTarjetas: number;
  incremNumeroTarjetas: number;
  retiro: boolean;
  cerrar: boolean;
  mensajeRetiro: string;
  informacionRetiro: InformacionAsociadaRetiroEfectivo;
  formasPagoInstance: EventEmitter<any>;
  _dataTransfer: DataTransferService;
  modalService: BsModalService;
  router: Router;
  ventaService: SalesService;
  reasonsCodesTransactionService: SalesService;
  _alertService: AlertService;
  _configService: ConfigPosService;
  _pagosMaster: PagosMasterService;
  generalService: GeneralService;

  /**Método para agregar pagos */
  addPago(pagosHechos: PagosMaster): void;

  /**Método que actualiza el total despues de agregar pagos */
  updateTotal(pagos: Array<FormaPagoUtilizado>): void;

  /**Metodo que elimina pagos */
  eliminar(lineaPago: LineaPago): void;

  /**Método para calcular el cambio de vales*/
  calculoCambioVales(index, totalTicket): void;

  /**Método para calcular el cambio de moneda  extranjera*/
  calculoCambioMonedaExtranjera(index, totalTicket): void;

  /**Método que cancela venta */
  cancelarVenta(): void;

  /**Método para calcular total apartado */
  totalApartado(): void;

  /**Método para limpiar ticketVirtual */
  resetTicket(): void;

  /**Método que calcula monto minimo a pagar en apartado */
  calcularMinimo(): void;

  /** Se actualizan variables dependiendo tipo de venta*/
  updateVenta(): void;

  /**Validacion de tipo de vale*/
  checkValeTipo(valeName: string): boolean;

  /**Modal para finalizar la venta */
  finalizarVenta(): void;

  /**Método para finalizar la venta */
  confirmFinalizarVenta(): void;

  /**Método q valida pago minimo en creacion de apartado*/
  validaPago(): boolean;

  /**Método para finalizar creacion de apartado */
  crearApartado(): void;

  /**Método para setear plazo del apartado */
  enviarPlazo(Plazo): void;

  /**Método para cerrar el diálogo*/
  closeModal(): void;

  /**Método para cerrar el diálogo de template finalziar incompleta la venta*/
  closeModalFinalizar(): void;

  /**Deshabilita botones de pago */
  deshabilitarBotones(tipoAction, hideFocus): void;

  retiroEfectivoModal(informacionRetiro: InformacionAsociadaRetiroEfectivo): void;

  closeModalRetiro(): void;

  retirarEfectivoConfirm(): void;
}

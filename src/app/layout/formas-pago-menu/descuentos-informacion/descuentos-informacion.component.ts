import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TicketVirtualComponentInterface } from '../../../Models/FrontEnd/TicketVirtualComponentInterface';
import { DescuentoPromocionalFormaPago, DescuentoPromocionalLineaModel } from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import { TipoPago, TipoPagoAccesoBoton } from '../../../shared/GLOBAL';
import { Decimal } from 'decimal.js/decimal';
import { DescuentoPromocionalVentaModel } from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import { DescuentoPromocionalAplicado } from '../../../Models/Sales/DescuentoPromocionalAplicado';
import { DescuentoService } from '../../../services/descuento.service';
import {DosDecimalesPipe} from '../../../pipes/dos-decimales.pipe';

@Component({
  selector: 'app-descuentos-informacion',
  templateUrl: './descuentos-informacion.component.html',
  styleUrls: ['./descuentos-informacion.component.css'],
  providers: [DosDecimalesPipe]
})
export class DescuentosInformacionComponent implements OnInit, OnChanges {

  @Input() totalTicket: number;
  @Input() ticketVirtualInstance: TicketVirtualComponentInterface;
  @Input() codigoFormaPago?: TipoPagoAccesoBoton;

  @Input() codigoValeSeleccionado?: TipoPago;
  @Input() codigoModenaExtranjeraSeleccionado?: TipoPago;
  @Input() formasDePagosDisponibles?;


  @Output() datosPromociones: EventEmitter<{
    promocionesPosiblesAplicablesLinea: Array<DescuentoPromocionalVentaModel>,
    promocionesPosiblesAplicablesVenta: Array<DescuentoPromocionalVentaModel>,
    promocionesPosiblesAplicablesVentaMM: Array<DescuentoPromocionalVentaModel>,
    descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>,
    descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>,
    totalAplicandoPromociones: Decimal
  }> = new EventEmitter();

  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  promocionesPosiblesVentaMM: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesPosiblesLinea: Array<DescuentoPromocionalAplicado> = [];
  descuentosPromocionalesPosiblesVenta: Array<DescuentoPromocionalAplicado> = [];
  totalAplicandoPromociones: Decimal;

  mostrarTipoPagosAplicables: boolean;

  constructor(public _descuentoService: DescuentoService, private dosDecimales: DosDecimalesPipe) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['codigoValeSeleccionado']) {
      this.codigoValeSeleccionado = changes['codigoValeSeleccionado'].currentValue;
      this.ngOnInit();
    }

  }


  getDescripcionFormaPago(formaPagos: Array<DescuentoPromocionalFormaPago>) {

    const descripciones = [];

    formaPagos.forEach(formaPago => {
      if (this.codigoFormaPago.indexOf(formaPago.codigoFormaPago) !== -1) {
        const formaPagoEncontrada = this.formasDePagosDisponibles.find(formaPagoDisponible => {
          if (this.isTipoVales(formaPagoDisponible)) {
            return formaPagoDisponible.codigoFormaPago === formaPago.codigoFormaPago;
          } else if (this.isTipoMonedaExtranjera(formaPagoDisponible)) {
            return formaPagoDisponible.codigo === formaPago.codigoFormaPago;
          }
        });
        descripciones.push(formaPagoEncontrada ? formaPagoEncontrada.descripcionCorta || formaPagoEncontrada.descripcion : '');
      }
    });

    return `(${descripciones.join(', ')})`;

  }

  ngOnInit() {


    if (this._descuentoService.descuentoApplied || this._descuentoService.pagoAdded) { // descuento ya aplicado, ya no se generan mas
      return;
    }

    this.promocionesPosiblesVenta = [];
    this.promocionesPosiblesLinea = [];
    this.promocionesPosiblesVentaMM = [];

    this.mostrarTipoPagosAplicables = this.codigoFormaPago === TipoPagoAccesoBoton.vales || this.codigoFormaPago === TipoPagoAccesoBoton.monedaExtranjera
      && (!!this.codigoValeSeleccionado);


    this.promocionesPosiblesVenta.push(
      ...this.ticketVirtualInstance.ticketVirtual.ticketDescuentos.descuentosPosiblesVenta.filter(
        descuento => descuento.descuentosPromocionalesFormaPago.findIndex(
          desc => this.codigoFormaPago.indexOf(desc.codigoFormaPago) !== -1
            && (this.codigoValeSeleccionado ? this.codigoValeSeleccionado === desc.codigoFormaPago : true)
            && (this.codigoModenaExtranjeraSeleccionado ? this.codigoValeSeleccionado === desc.codigoFormaPago : true)
        ) !== -1)
    );

    this.promocionesPosiblesLinea.push(
      ...this.ticketVirtualInstance.ticketVirtual.ticketDescuentos.descuentosPosiblesLinea.filter(
        descuento => descuento.descuentosPromocionalesFormaPago.findIndex(
          desc => this.codigoFormaPago.indexOf(desc.codigoFormaPago) !== -1
            && (this.codigoValeSeleccionado ? this.codigoValeSeleccionado === desc.codigoFormaPago : true)
            && (this.codigoModenaExtranjeraSeleccionado ? this.codigoValeSeleccionado === desc.codigoFormaPago : true)
        ) !== -1)
    );

    this.promocionesPosiblesVentaMM.push(
      ...this.ticketVirtualInstance.ticketVirtual.ticketDescuentos.descuentosPromocionalesPosiblesAplicadosVentaMM.filter(
        descuento => descuento.descuentosPromocionalesFormaPago.findIndex(
          desc => this.codigoFormaPago.indexOf(desc.codigoFormaPago) !== -1
        ) !== -1)
    );

    this.totalAplicandoPromociones = new Decimal(this.ticketVirtualInstance.ticketVirtual.totalTicket);


    this.descuentosPromocionalesPosiblesLinea = this.promocionesPosiblesLinea.map(promocion => {
      this.totalAplicandoPromociones = this.totalAplicandoPromociones.minus(promocion.importeDescuento);
      return new DescuentoPromocionalAplicado({
        codigoPromocionAplicado: promocion.codigoPromocionAplicado,
        descripcionCodigoPromocionAplicado: promocion.descripcionCodigoPromocionAplicado,
        importeDescuento: promocion.importeDescuento,
        codigoRazonDescuento: promocion.codigoRazonDescuento,
        porcentajeDescuento: promocion.porcentajeDescuento,
        formaPagoCodigoPromocionAplicado: null,
        secuencia: promocion.secuencia
      });
    });


    this.descuentosPromocionalesPosiblesVenta = this.promocionesPosiblesVenta.map(promocion => {
      this.totalAplicandoPromociones = this.totalAplicandoPromociones.minus(promocion.importeDescuento);
      return new DescuentoPromocionalAplicado({
        codigoPromocionAplicado: promocion.codigoPromocionAplicado,
        descripcionCodigoPromocionAplicado: promocion.descripcionCodigoPromocionAplicado,
        importeDescuento: promocion.importeDescuento,
        formaPagoCodigoPromocionAplicado: null,
        codigoRazonDescuento: promocion.codigoRazonDescuento,
        porcentajeDescuento: promocion.porcentajeDescuento,
        secuencia: promocion.secuencia
      });
    });

   /* this.descuentosPromocionalesPosiblesVenta = this.promocionesPosiblesVentaMM.map(promocion => {
      this.totalAplicandoPromociones = this.totalAplicandoPromociones.minus(promocion.importeDescuento);
      return new DescuentoPromocionalAplicado({
        codigoPromocionAplicado: promocion.codigoPromocionAplicado,
        descripcionCodigoPromocionAplicado: promocion.descripcionCodigoPromocionAplicado,
        importeDescuento: promocion.importeDescuento,
        formaPagoCodigoPromocionAplicado: promocion.formaPagoCodigoPromocionAplicado,
        codigoRazonDescuento: promocion.codigoRazonDescuento,
        porcentajeDescuento: promocion.porcentajeDescuento,
        secuencia: promocion.secuencia
      });
    });*/

    this.totalAplicandoPromociones = new Decimal(this.dosDecimales.calc(this.totalAplicandoPromociones.toNumber()));

    this.datosPromociones.emit({
        promocionesPosiblesAplicablesLinea: this.promocionesPosiblesLinea,
        promocionesPosiblesAplicablesVenta: this.promocionesPosiblesVenta,
        promocionesPosiblesAplicablesVentaMM: this.promocionesPosiblesVentaMM,
        descuentosPromocionalesAplicadosLinea: this.descuentosPromocionalesPosiblesLinea,
        descuentosPromocionalesAplicadosVenta: this.descuentosPromocionalesPosiblesVenta,
        totalAplicandoPromociones: this.totalAplicandoPromociones
      }
    );

  }


  isTipoVales(value: any): value is { codigoFormaPago: string, descripcionCorta: string } {
    return value && value.codigoFormaPago;
  }

  isTipoMonedaExtranjera(value: any): value is { codigo: string, descripcion: string } {
    return value && value.codigo;
  }
}

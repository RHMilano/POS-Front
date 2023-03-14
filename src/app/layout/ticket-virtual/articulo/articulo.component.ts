import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { TicketRow } from '../TicketRow';
import { FlujoBloqueo, TipoDetalleVenta, TiposProductos } from '../../../shared/GLOBAL';
import { LineaTicket, LineaTicketDevolucion } from '../../../Models/Sales/LineaTicket';
import { EliminarLineaTicket } from '../../../Models/Sales/EliminarLineaTicket';
import { SudoCallbackFactory } from '../../../Models/General/SudoCallbackFactory';
import { BsModalService } from 'ngx-bootstrap';
import { TicketVirtualComponentInterface } from '../../../Models/FrontEnd/TicketVirtualComponentInterface';
import { DevolverArticuloRequest } from '../../../Models/Sales/DevolverArticuloRequest';
import { RazonesCancelacionComponent } from '../../razones-cancelacion/razones-cancelacion.component';
import { ArticuloComponentInterface } from '../../../Models/FrontEnd/ArticuloComponentInterface';
import { LineaTicketModel } from '../../../Models/Sales/LineaTicket.model';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit, OnChanges, ArticuloComponentInterface {

  @Input() ticketRow: TicketRow; // articulo
  @Input() index: number; // index del articulo
  @Input() currentSelection: number; // index del articulo que se encuentra seleccionado
  @Output() selectedItem = new EventEmitter(); // aquí se regresa el articulo si es que fue seleccionado
  @Output() articuloInstance = new EventEmitter(); // aquí se regresa esta instancia
  @Input() ticketVirtual: TicketVirtualComponentInterface; // articulo
  @Input() currentQty: number; // articulo

  @ViewChild('articuloRow') articuloRow: ElementRef;
  @ViewChild('articuloQty') articuloQty: ElementRef;

  articuloQtyDev: ElementRef;

  showCantidadControl: boolean;
  showRemoveTarjetaRegalo: boolean;
  disableDevolucion: boolean;
  cantidadNueva: number;

  razonDevolucion: number;

  lineaTicket: LineaTicket;
  cantidadAnterior: number;

  keyboardUnListener: () => void;

  keyboardEdition: boolean;

  constructor(public _modalService: BsModalService, public _renderer: Renderer2) {
  }

  ngOnInit() {
    this.showCantidadControl = this.ticketRow.tipoProducto === TiposProductos.prenda;
    this.showRemoveTarjetaRegalo = this.ticketRow.tipoProducto === TiposProductos.tarjetaRegalo;
    this.articuloInstance.emit(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSelection']) {
      if (this.index === this.currentSelection) {

        this.setFocusOnQty();

        this.keyboardUnListener = this._renderer.listen(this.articuloRow.nativeElement, 'keyup', (event: KeyboardEvent) => {

          const keyCode = event.which || event.keyCode;

          if (keyCode === 187 || keyCode === 107) {
            this.addOneProduct();
          } else if (keyCode === 189 || keyCode === 109) {
            this.removeOneProduct();
          } else if ((keyCode >= 48 && keyCode <= 57) || keyCode === 8 || keyCode === 46) {
            this.keyboardEdition = true;
          }
        });

      } else {

        if (this.keyboardUnListener) {
          this.keyboardUnListener();
        }

      }
    }
  }

  setClickedRow(index) {
    this.currentSelection = index;
    this.selectedItem.emit({
      item: this.ticketRow, index: index
    });
    this.setFocusOnQty();
  }

  setFocusOnQty() {

    if (this._modalService.getModalsCount() === 0 && (this.index === this.currentSelection)) {
      setTimeout(() => {
        try {
          if (this.ticketVirtual.isModoDevolucion) {
            this.articuloQtyDev.nativeElement.focus();
            this.articuloQtyDev.nativeElement.setSelectionRange(0, this.currentQty.toString().length);
          } else {
            this.articuloQty.nativeElement.focus();
            this.articuloQty.nativeElement.setSelectionRange(0, this.currentQty.toString().length);
          }

        } catch (e) {
        }
      }, 0);
    }
  }

  removeOneProduct() {

    if (this.ticketRow.lineaTicket.cantidadVendida === 0) {
      return;
    }

    if ((typeof this.currentQty === 'string' && this.currentQty === '') || this.keyboardEdition) {
      this.currentQty = this.ticketRow.lineaTicket.cantidadVendida;
      return;
    }

    this.cantidadAnterior = this.ticketRow.lineaTicket.cantidadVendida;
    this.lineaTicket = this.getLineaTicket(this.ticketRow.lineaTicket.getLineaTicket()); // new LineaTicket(this.ticketRow.lineaTicket.getLineaTicket());
    this.lineaTicket.removeCantidadVendida();

    this.cantidadNueva = Number(this.currentQty) - 1;
    if (this.cantidadNueva === 0) {
      this.disableDevolucion = true;
    }

    this.updateQty();
  }

  removeLineaProduct() {
    this.cantidadAnterior = this.ticketRow.lineaTicket.cantidadVendida;
    this.lineaTicket = this.getLineaTicket(this.ticketRow.lineaTicket.getLineaTicket()); // new LineaTicket(this.ticketRow.lineaTicket.getLineaTicket());
    this.lineaTicket.cantidadVendida = 0;
    this.cantidadNueva = 0;
    this.disableDevolucion = true;
    this.updateQty();
  }

  addOneProduct() {


    if ((typeof this.currentQty === 'string' && this.currentQty === '') || this.keyboardEdition) {
      this.currentQty = this.ticketRow.lineaTicket.cantidadVendida;
      return;
    }

    this.cantidadAnterior = this.ticketRow.lineaTicket.cantidadVendida;
    this.lineaTicket = this.getLineaTicket(this.ticketRow.lineaTicket.getLineaTicket()); // new LineaTicket(this.ticketRow.lineaTicket.getLineaTicket());
    this.lineaTicket.addCantidadVendida();

    this.cantidadNueva = Number(this.currentQty) + 1;
    if (this.cantidadNueva > 0) {
      this.disableDevolucion = false;
    }

    this.updateQty();
  }

  updateQty(value?: any) {

    this.keyboardEdition = false;

    if (value === '') {
      this.currentQty = this.ticketRow.lineaTicket.cantidadVendida;
      return;
    }


    if (value) {
      this.cantidadAnterior = this.ticketRow.lineaTicket.cantidadVendida;
      this.cantidadNueva = Number(value);
      this.lineaTicket = this.getLineaTicket(this.ticketRow.lineaTicket.getLineaTicket()); // new LineaTicket(this.ticketRow.lineaTicket.getLineaTicket());
      this.lineaTicket.cantidadVendida = Number(value);


      if (this.lineaTicket.perteneceVentaOriginal && this.cantidadAnterior > this.cantidadNueva) {
        this.lineaTicket.cantidadDevuelta = Number(this.cantidadAnterior) - Number(this.cantidadNueva);
      }

    }

    if (this.cantidadNueva < this.cantidadAnterior || (this.currentQty === 0 || this.cantidadNueva === 0)) {

      const callBackStr = this.lineaTicket.perteneceVentaOriginal ? 'pedirRazonDevolicion' : 'updateLineaTicket';

      return new SudoCallbackFactory({
        component: this,
        ModalLevel: 1,
        passthroughAdmin: true,
        callBack: callBackStr,
        cancelCallback: 'rollbackEliminar',
        modalService: this._modalService
      });

    } else {
      this.updateLineaTicket();
    }

  }

  pedirRazonDevolicion() {
    const initialState = {articuloInstance: this};
    this._modalService.show(RazonesCancelacionComponent, {initialState, backdrop: 'static', keyboard: false});

    this._modalService.onHidden.take(1).subscribe(() => {
      this.updateLineaTicket();
    });

  }

  setRazonDevolucion(codigoRazon: number) {
    this.razonDevolucion = codigoRazon;
  }

  updateLineaTicket() {

    if (this.currentQty === 0 || this.cantidadNueva === 0) {
      // flujo de eliminacion

      let lineasTicketCalculo: Array<LineaTicket>;
      const secuenciaOriginalLineaTicket = this.ticketRow.lineaTicket.secuencia;

      this.lineaTicket.codigoTipoDetalleVenta = TipoDetalleVenta.eliminarLineaTicket;
      this.lineaTicket.cantidadVendida = this.cantidadAnterior;


      if (!this.lineaTicket.perteneceVentaOriginal) {
        this.lineaTicket.secuencia = this.ticketVirtual.ticketVirtual.secuencia + 1;
        lineasTicketCalculo = this.ticketVirtual.ticketVirtual.generaLineasTicketEliminarLinea(this.ticketRow);
      } else {
        lineasTicketCalculo = this.ticketVirtual.ticketVirtual.generaLineasTicketDevolucion(this.ticketRow, this.lineaTicket);
      }

      this.ticketVirtual.ticketVirtual.cabeceraVenta.setImportesFromLineaTicket(lineasTicketCalculo);


      const eliminarLinea = new EliminarLineaTicket({
        lineaTicket: this.lineaTicket.getLineaTicket(),
        secuenciaOriginalLineaTicket: secuenciaOriginalLineaTicket,
        codigoRazon: this.razonDevolucion || 0
      });

      this.ticketVirtual.sendEliminarLineaTicket(eliminarLinea).then(
        resp => {
          if (resp && Number(resp.codeNumber) === 308) {

            /** Importante hacer el reset antes de hacer los nuevos calculos **/
            this.resetTotalizarTicket();

            this.currentSelection = null;

            if (this.lineaTicket.perteneceVentaOriginal) {

              this.currentQty = this.cantidadNueva;
              this.ticketRow.lineaTicket.cantidadVendida = this.currentQty;
              this.ticketRow.lineaTicket.cantidadDevuelta = this.lineaTicket.cantidadDevuelta;
              this._renderer.setAttribute(this.articuloQtyDev.nativeElement, 'disabled', 'true');

            } else {

              this.ticketVirtual.ticketVirtual.secuencia++;
              this.ticketVirtual.ticketVirtual.removeArticulo(this.ticketRow);
              this.ticketVirtual.currentSelection = null;

            }


            this.ticketVirtual.ticketVirtual.calculateTotal();
            this.ticketVirtual.clearSeachField();
            this.ticketVirtual.bloqueaBotones(FlujoBloqueo.removedItem);
            this.ticketVirtual.focusOnSkuInput();
          } else {
            this.rollbackEliminar();
          }
          this.ticketVirtual.bloqueaBotones(FlujoBloqueo.falloTotalizar);
        }
      ).catch(() => {
        this.rollbackEliminar();
      });

    } else {

      this.ticketRow.removePromocionesFromLinea();
      this.lineaTicket.descuentosPromocionalesAplicadosLinea = [];
      this.lineaTicket.descuentosPromocionalesPosiblesLinea = [];
      this.lineaTicket.getLineaTicket();


      let lineasTicketCalculo: Array<LineaTicket>;

      if (!this.lineaTicket.perteneceVentaOriginal) {
        lineasTicketCalculo = this.ticketVirtual.ticketVirtual.generaLineasTicketCambioPieza(this.ticketRow, this.lineaTicket);
      } else {
        lineasTicketCalculo = this.ticketVirtual.ticketVirtual.generaLineasTicketDevolucion(this.ticketRow, this.lineaTicket);
      }

      this.ticketVirtual.ticketVirtual.cabeceraVenta.setImportesFromLineaTicket(lineasTicketCalculo);


      if (this.lineaTicket.perteneceVentaOriginal) { // devolucion

        const devolucionRequest = new DevolverArticuloRequest({
          lineaTicket: this.lineaTicket.getLineaTicket(), codigoRazon: this.razonDevolucion
        });

        this.ticketVirtual.sendCambioPiezasLineaTicketDevolucion(devolucionRequest).then(
          resp => {
            /** Importante hacer el reset antes de hacer los nuevos calculos **/
            if (resp && Number(resp.codeNumber) === 100) {

              this.resetTotalizarTicket();

              this.currentQty = this.cantidadNueva;
              this.ticketRow.lineaTicket.cantidadVendida = this.currentQty;
              this.ticketRow.lineaTicket.cantidadDevuelta = this.lineaTicket.cantidadDevuelta;
              this.ticketRow.updateGrandTotal();
              this.ticketVirtual.ticketVirtual.calculateTotal();
              this.ticketVirtual.bloqueaBotones();
              this.setFocusOnQty();
            } else {
              this.rollbackCambioPiezasLineaTicket();
            }
          }
        ).catch(
          err => {
            this.rollbackCambioPiezasLineaTicket();
          }
        );

      } else {


        this.ticketVirtual.sendCambioPiezasLineaTicket(this.lineaTicket).then(
          resp => {
            if (resp && Number(resp.codeNumber) === 308) {

              /** Importante hacer el reset antes de hacer los nuevos calculos **/
              this.resetTotalizarTicket();

              this.currentQty = this.cantidadNueva;
              this.ticketRow.lineaTicket.cantidadVendida = this.currentQty;
              this.ticketRow.updateGrandTotal();
              this.ticketVirtual.ticketVirtual.calculateTotal();
              this.ticketVirtual.bloqueaBotones();
              this.setFocusOnQty();
            } else {
              this.rollbackCambioPiezasLineaTicket();
            }
            this.ticketVirtual.bloqueaBotones(FlujoBloqueo.falloTotalizar);
          }
        ).catch(err => this.rollbackCambioPiezasLineaTicket());

      }
    }

    this.razonDevolucion = 0;
  }


  rollbackCambioPiezasLineaTicket() {
    this.currentQty = this.cantidadAnterior;
    this.ticketRow.lineaTicket.cantidadVendida = this.cantidadAnterior;
    this.ticketRow.updateGrandTotal();
    this.ticketVirtual.ticketVirtual.calculateTotal();
    this.setFocusOnQty();
  }


  resetTotalizarTicket() {
    this.ticketRow.removePromocionesFromLinea();
    this.ticketVirtual.setTicketTotalizado(false);
  }

  rollbackEliminar() {
    this.currentQty = this.cantidadAnterior;
    if (this.currentQty > 0) {
      this.disableDevolucion = false;
    }
    this.setFocusOnQty();
  }


  getLineaTicket(lineaTicket: LineaTicketModel): LineaTicket {

    if (lineaTicket.perteneceVentaOriginal) {
      return new LineaTicketDevolucion(lineaTicket);
    } else {
      return new LineaTicket(lineaTicket);
    }
  }
}


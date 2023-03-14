import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { AlertService } from '../../services/alert.service';
import { EstatusTarjetaRegalo } from '../../shared/GLOBAL';
import { InformacionFoliosTarjeta } from '../../Models/Sales/InformacionFoliosTarjeta';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { FormasDePagoComponentInterface } from '../../Models/FrontEnd/FormasDePagoComponentInterface';

@Component({
  selector: 'app-venta-tarjeta-regalo',
  templateUrl: './venta-tarjeta-regalo.component.html',
  styleUrls: ['./venta-tarjeta-regalo.component.css'],
  providers: [GeneralService]
})
export class VentaTarjetaRegaloComponent implements OnInit {
  modalRef: any;

  numeroTarjeta;
  tarjetaRegaloForm: FormGroup;
  @Input() ticketVirtualInstance: TicketVirtualComponentInterface;
  @Input() finalizarVenta: InformacionFoliosTarjeta;
  @Input() pagosInstance: FormasDePagoComponentInterface;
  @Input() precioTarjeta: number;
  @Input() apartado: boolean;

  constructor(private _generalService: GeneralService, private _dataTransfer: DataTransferService,
              private _alertService: AlertService, private modalService: BsModalService, public _bsModalRef: BsModalRef) {
  }

  ngOnInit() {

    this.tarjetaRegaloForm = new FormGroup({
      numeroTarjetaRegalo: new FormControl('', Validators.compose([
        Validators.required, this.tarjetaRegaloValidator()
      ]))
    });

    this.tarjetaRegaloForm.get('numeroTarjetaRegalo').hasError('required');
  }

  tarjetaRegaloValidator(): ValidatorFn {
    return (c: FormControl) => {
      const isValid = /^[0-9]{6}$/.test(c.value);
      if (!c.value) {
        return null;
      }
      if (isValid) {
        return null;
      } else {
        return {
          numeroTRValidator: {
            valid: false
          }
        };
      }
    };
  }

  onAceptarTarjeta() {
    this._generalService.GetTarjetaRegalo(
      this.tarjetaRegaloForm.get('numeroTarjetaRegalo').value).subscribe(
      tarjetaInfo => {
        if (tarjetaInfo.length) {
          const articulo = tarjetaInfo[0];

          if (this.ticketVirtualInstance.ticketVirtual.findTarjetaRegalo(articulo.articulo.informacionTarjetaRegalo.folioTarjeta)) {
            this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: 'Este art\u00EDculo ya fue ingresado al ticket de venta'});
            return;
          }

          if (articulo.articulo.informacionTarjetaRegalo.estatus !== EstatusTarjetaRegalo.ListaParaVender.toString()) {
            this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: 'Tarjeta ya fue Activada'});
            return;
          }
          // this._dataTransfer.$articuloTicketVirtual.next(articulo);

          if (this.precioTarjeta !== articulo.articulo.precioConImpuestos) {
            this._alertService.show({
              tipo: 'error',
              titulo: 'Milano',
              mensaje: 'El folio de la tarjeta ingresado debe ser de $' + this.precioTarjeta
            });
            return;
          } else {
            this.finalizarVenta.folioTarjeta = this.numeroTarjeta;
            this.onCancelarTarjeta();
            this.pagosInstance.incremNumeroTarjetas++;
            if (!this.apartado) {
              this.pagosInstance.finalizarVenta();
            } else {
              this.pagosInstance.crearApartado();
            }
          }
        } else {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Articulo no encontrado'});
        }
      }
    );
  }

  onCancelarTarjeta() {
    this._bsModalRef.hide();
  }
}


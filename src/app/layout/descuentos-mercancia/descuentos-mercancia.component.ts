import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { TipoDescuento } from '../../shared/GLOBAL';
import { Descuento, DescuentoRequest } from '../../Models/Sales/Descuento.model';
import { SalesService } from '../../services/sales.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { MercanciaRequest } from '../../Models/Sales/MercanciaRequest';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AlertService } from '../../services/alert.service';
import { Decimal } from 'decimal.js';

@Component({
  selector: 'app-descuentos-mercancia',
  templateUrl: './descuentos-mercancia.component.html',
  styleUrls: ['./descuentos-mercancia.component.css'],
  providers: [SalesService]
})
export class DescuentosMercanciaComponent implements OnInit, AfterViewInit {


  @Input() tipoDescuento: TipoDescuento;
  @Input() rowItem: DescuentoRequest;
  @Input() cantidad: number;
  razon: string;
  montoDescuento: number;
  codigoRazon: number;
  uLSession: string;
  descuento: string;

  constructor(public  modalRef: BsModalRef, private _salesService: SalesService,
              public _dataTransfer: DataTransferService, public _alertService: AlertService) {
  }

  ngAfterViewInit(): void {
    if (this.tipoDescuento === TipoDescuento.picos) {
      setTimeout(() => this.getDescuentoPicos(), 500);
      this.razon = 'Picos de Mercancía';
    } else {
      setTimeout(() => this.getDescuentoDaniada(), 500);
      this.razon = 'Mercancía Dañada';
    }
    this.descuento = 'I2';
  }


  ngOnInit() {

  }

  getDescuentoPicos() {
    const mercanciaRequest = new MercanciaRequest();
    mercanciaRequest.cantidad = this.cantidad;
    mercanciaRequest.sku = this.rowItem.sku;

    this._salesService.picosMercanciaService(mercanciaRequest).subscribe(resp => {
      if (resp.error === '') {
        this.montoDescuento = resp.porcentanjeDescuento;
        this.codigoRazon = resp.codigoRazon;
        this.uLSession = resp.uLSession;
        this.aplicaDescuento();
      } else {
        this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: resp.error});
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.modalRef.hide();
  }

  getDescuentoDaniada() {
    const mercanciaRequest = new MercanciaRequest();
    mercanciaRequest.cantidad = this.cantidad;
    mercanciaRequest.sku = this.rowItem.sku;

    this._salesService.mercanciaDaniadaService(mercanciaRequest).subscribe(resp => {
      if (resp.porcentanjeDescuento !== Number(0)) {
        this.montoDescuento = resp.porcentanjeDescuento;
        this.codigoRazon = resp.codigoRazon;
        this.uLSession = resp.uLSession;
        this.aplicaDescuento();
      } else {
        this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: resp.error});
        this.closeModal();
      }
    });
  }

  aplicaDescuento() {
    let descuento: Descuento;

    const cantidadDesc = new Decimal(this.rowItem.itemPrice).dividedBy(100).times(this.montoDescuento).toDP(2, 1);


    descuento = new Descuento({
      porcentajeDescuento: Number(this.montoDescuento),
      importeDescuento: cantidadDesc.toNumber(),
      tipoDescuento: this.descuento,
      precioFinal: new Decimal(this.rowItem.itemPrice).minus(cantidadDesc).toNumber(),
      codigoRazonDescuento: this.codigoRazon,
      descripcionRazonDescuento: this.razon,
      uLSession: this.uLSession,
      sku: this.rowItem.sku
    });
    this._dataTransfer.$applyDiscount.next(descuento);
    this.closeModal();

  }
}


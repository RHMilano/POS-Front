import { Component, Input, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { ReasonsCodesTransactionRequest } from '../../Models/Sales/ReasonsCodesTransactionRequest';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DataTransferService } from '../../services/data-transfer.service';
import { Descuento, DescuentoRequest } from '../../Models/Sales/Descuento.model';
import { TipoDescuento } from '../../shared/GLOBAL';
import { ConfigPosService } from '../../services/config-pos.service';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Decimal } from 'decimal.js/decimal';
import { SolicitudAutorizacionDescuentoRequest } from '../../Models/Sales/SolicitudAutorizacionDescuentoRequest';
import { WsPosResponseModel } from '../../Models/Sales/OperationResponse.model';
import { AlertService } from '../../services/alert.service';
import { SolicitudAutorizacionDescuentoResponse } from '../../Models/Sales/SolicitudAutorizacionDescuentoResponse';


@Component({
  selector: 'app-descuentos',
  templateUrl: './descuentos.component.html',
  styleUrls: ['./descuentos.component.css'],
  providers: [SalesService]
})

export class DescuentosComponent implements OnInit {
  montoDescuento: number = null;
  descuentoCodigo: number;
  @Input() tipoDescuento: TipoDescuento;
  @Input() rowItem: DescuentoRequest;

  catRazonesDecuentoPorcentaje: Array<{ codigoRazon: number, codigoRazonMMS: string, descripcionRazon: string }>;
  catRazonesDecuentoImporte: Array<{ codigoRazon: number, codigoRazonMMS: string, descripcionRazon: string }>;
  razonSeleccionada: { codigoRazon: number, codigoRazonMMS: string, descripcionRazon: string };

  descuentoForm: FormGroup;
  porcentajeDescMax: number;

    // OCG
    //montoDescuentoVal: number;
    autorizacion = new SolicitudAutorizacionDescuentoRequest;
    wsPosResponseModel: WsPosResponseModel;
    codeDescription: string;
    codeNumber: string;

  constructor(public _bsModalRef: BsModalRef,
              private _salesService: SalesService,
              public _dataTransfer: DataTransferService,
              private _configService: ConfigPosService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    //this.montoDescuentoVal = 0;
    this.getDiscountReasons();
    this.descuentoForm = new FormGroup({
      montoDescuento: new FormControl('', Validators.compose([
        Validators.required, this.getDescuentoValidator()
      ])),
      descuentoCodigo: new FormControl('', Validators.required)
    });
    this.porcentajeDescMax = this._configService.currentConfig.porcentajeMaximoDescuentoDirecto;
    //alert(`porcentajeDescMax: ${JSON.stringify(this.porcentajeDescMax)}`);
  }


  getDescuentoValidator(): ValidatorFn {
    return (c: FormControl) => {

      if (!c.value) {
        return null;
      }

      let desctCalculado: number;
      const desctMax = this.rowItem.itemPrice * (this.porcentajeDescMax / 100);

      if (this.tipoDescuento === TipoDescuento.porcentaje) {
        desctCalculado = this.rowItem.itemPrice * (c.value / 100);
      } else {
        desctCalculado = c.value;
      }

      if (desctCalculado > desctMax) {
        return {
          descuentoMaximoExcedido: {
            valid: false
          }
        };
      }

      return null;

    };
  }

  getDiscountReasons() {
    this.catRazonesDecuentoPorcentaje = [];
    this.catRazonesDecuentoImporte = [];
    const reasonRequest = new ReasonsCodesTransactionRequest();
    reasonRequest.codigoTipoRazonMMS = 'IDS0';
    this._salesService.ReasonsCodesTransactionService(reasonRequest).subscribe(response => {
      response.forEach(reason => {
       
        if (reason.descripcionRazon.indexOf('% - ') !== -1) {
          reason.descripcionRazon.replace('% - ', '');
          this.catRazonesDecuentoPorcentaje.push(reason);
        } else {
          reason.descripcionRazon.replace('$ - ', '');
          this.catRazonesDecuentoImporte.push(reason);
        }
      });
      //console.log(JSON.stringify( this.catRazonesDecuentoPorcentaje));
      //console.log(JSON.stringify( this.catRazonesDecuentoImporte));
    });


  }

  selectRazon(razon) {
    this.razonSeleccionada = razon;
  }

  validaDescuento(event) {
  }

  applyDescuentoAutomatico() {

    if (this.montoDescuento !== null && this.descuentoCodigo !== null) {
      let descuento: Descuento;

      if (this.tipoDescuento === TipoDescuento.porcentaje) {

        const cantidadDesc = new Decimal(this.rowItem.itemPrice).dividedBy(100).times(this.montoDescuento).toDP(2, 1);

        descuento = new Descuento({
          porcentajeDescuento: Number(this.montoDescuento),
          importeDescuento: cantidadDesc.toNumber(),
          tipoDescuento: TipoDescuento.porcentaje,
          precioFinal: new Decimal(this.rowItem.itemPrice).minus(cantidadDesc).toNumber(),
          codigoRazonDescuento: this.razonSeleccionada.codigoRazon,
          descripcionRazonDescuento: this.razonSeleccionada.descripcionRazon,
          rowIndex: this.rowItem.rowIndex,
          sku: this.rowItem.sku
        });

        //OCG: Asignar los valores para la autorizacion
        this.autorizacion.codigoTienda = 0;
        this.autorizacion.folioVenta = '';
        this.autorizacion.montoVenta = new Decimal(this.rowItem.itemPrice);
        this.autorizacion.codigoCaja = 0;
        this.autorizacion.codigoRazonDescuento = this.razonSeleccionada.codigoRazon;
        this.autorizacion.opcionDescuento = 1;
        this.autorizacion.tipoDescuento = this.tipoDescuento;
        this.autorizacion.montoDescuento =  ((this.rowItem.itemPrice * this.montoDescuento) / 100);
        this.autorizacion.linea = this.rowItem.rowIndex + 1;
        this.autorizacion.sku = this.rowItem.sku; 

      } else {

        const porcentajeDesc = new Decimal(this.montoDescuento).plus(100).dividedBy(this.rowItem.itemPrice);

        descuento = new Descuento({
          porcentajeDescuento: porcentajeDesc.toNumber(),
          importeDescuento: Number(this.montoDescuento),
          tipoDescuento: TipoDescuento.importe,
          precioFinal: new Decimal(this.rowItem.itemPrice).minus(this.montoDescuento).toNumber(),
          codigoRazonDescuento: this.razonSeleccionada.codigoRazon,
          descripcionRazonDescuento: this.razonSeleccionada.descripcionRazon,
          rowIndex: this.rowItem.rowIndex,
          sku: this.rowItem.sku
        });

          //OCG: Asignar los valores para la autorizacion
          this.autorizacion.codigoTienda = 0;
          this.autorizacion.folioVenta = '';
          this.autorizacion.montoVenta = new Decimal(this.rowItem.itemPrice);
          this.autorizacion.codigoCaja = 0;
          this.autorizacion.codigoRazonDescuento = this.razonSeleccionada.codigoRazon;
          this.autorizacion.opcionDescuento = 1;
          this.autorizacion.tipoDescuento = this.tipoDescuento;
          this.autorizacion.montoDescuento = Number(this.montoDescuento);
          this.autorizacion.linea =this.rowItem.rowIndex + 1;
          this.autorizacion.sku = this.rowItem.sku; 
          
      }


      this._salesService.solicitudAutorizacionDescuentoService(this.autorizacion).subscribe((data: SolicitudAutorizacionDescuentoResponse) => {

        //console.log(`DATA: ${JSON.stringify(data)}`);
        //console.log(data.mensaje);
        this.codeDescription = data.mensaje;
        this.codeNumber = data.codeNumber;

      }, (error) => {

      }, () => {

        if (this.codeNumber != "100") {
          this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: this.codeDescription });
        } else {
          this._dataTransfer.$applyDiscount.next(descuento);
          this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: this.codeDescription });
        }

      });


      //this._dataTransfer.$applyDiscount.next(descuento);



      this.montoDescuento = null;
      this.descuentoCodigo = null;
      this._bsModalRef.hide();
    }
  }



  applyDescuento() {

    if (this.montoDescuento !== null && this.descuentoCodigo !== null) {
      let descuento: Descuento;

      if (this.tipoDescuento === TipoDescuento.porcentaje) {

        const cantidadDesc = new Decimal(this.rowItem.itemPrice).dividedBy(100).times(this.montoDescuento).toDP(2, 1);

        descuento = new Descuento({
          porcentajeDescuento: Number(this.montoDescuento),
          importeDescuento: cantidadDesc.toNumber(),
          tipoDescuento: TipoDescuento.porcentaje,
          precioFinal: new Decimal(this.rowItem.itemPrice).minus(cantidadDesc).toNumber(),
          codigoRazonDescuento: this.razonSeleccionada.codigoRazon,
          descripcionRazonDescuento: this.razonSeleccionada.descripcionRazon,
          rowIndex: this.rowItem.rowIndex,
          sku: this.rowItem.sku
        });

      } else {

        const porcentajeDesc = new Decimal(this.montoDescuento).plus(100).dividedBy(this.rowItem.itemPrice);

        descuento = new Descuento({
          porcentajeDescuento: porcentajeDesc.toNumber(),
          importeDescuento: Number(this.montoDescuento),
          tipoDescuento: TipoDescuento.importe,
          precioFinal: new Decimal(this.rowItem.itemPrice).minus(this.montoDescuento).toNumber(),
          codigoRazonDescuento: this.razonSeleccionada.codigoRazon,
          descripcionRazonDescuento: this.razonSeleccionada.descripcionRazon,
          rowIndex: this.rowItem.rowIndex,
          sku: this.rowItem.sku
        });

      }

      this._dataTransfer.$applyDiscount.next(descuento);
      this.montoDescuento = null;
      this.descuentoCodigo = null;
      this._bsModalRef.hide();
    }
  }


  cancelDescuento() {
    this.montoDescuento = null;
    this.descuentoCodigo = null;
    this._bsModalRef.hide();

  }

}

import { Component, Input, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { ReasonsCodesTransactionRequest } from '../../Models/Sales/ReasonsCodesTransactionRequest';
import { SolicitudAutorizacionDescuentoRequest } from '../../Models/Sales/SolicitudAutorizacionDescuentoRequest'; // OCG:
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DataTransferService } from '../../services/data-transfer.service';
import { Descuento, DescuentoRequest } from '../../Models/Sales/Descuento.model';
import { TipoDescuento } from '../../shared/GLOBAL';
import { ConfigPosService } from '../../services/config-pos.service';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Decimal } from 'decimal.js/decimal';
import { SolicitudAutorizacionDescuentoResponse } from '../../Models/Sales/SolicitudAutorizacionDescuentoResponse';
import { WsPosResponseModel } from '../../Models/Sales/OperationResponse.model';
import { MsgService } from '../../services/msg.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-descuentos-transaccion',
  templateUrl: './descuentos-transaccion.component.html',
  styleUrls: ['./descuentos-transaccion.component.css'],
  providers: [SalesService]
})
export class DescuentosTransaccionComponent implements OnInit {
  montoDescuento: number = null;
  descuentoCodigo: number;
  @Input() tipoDescuento: TipoDescuento;
  @Input() rowItem: Array<DescuentoRequest>;

  totalSale: number;

  catRazonesDecuentoPorcentaje: Array<{ codigoRazon: number, codigoRazonMMS: string, descripcionRazon: string }>;
  catRazonesDecuentoImporte: Array<{ codigoRazon: number, codigoRazonMMS: string, descripcionRazon: string }>;
  razonSeleccionada: { codigoRazon: number, codigoRazonMMS: string, descripcionRazon: string };

  descuentoForm: FormGroup;
  porcentajeDescMax: number;


  // OCG
  autorizacion = new SolicitudAutorizacionDescuentoRequest;
  wsPosResponseModel: WsPosResponseModel;
  codeDescription: string;
  codeNumber: string;

  constructor(public _bsModalRef: BsModalRef,
    private _salesService: SalesService,
    public _dataTransfer: DataTransferService,
    private _configService: ConfigPosService,
    private _msg: MsgService,
    private alertService: AlertService) {
    this.wsPosResponseModel = new WsPosResponseModel();
  }

  ngOnInit() {
    this.getDiscountReasons();
    this.descuentoForm = new FormGroup({
      montoDescuento: new FormControl('', Validators.compose([
        Validators.required, this.getDescuentoValidator()
      ])),
      descuentoCodigo: new FormControl('', Validators.required)
    });
    this.porcentajeDescMax = this._configService.currentConfig.porcentajeMaximoDescuentoDirecto;
    //alert(`porcentajeDescMax: ${JSON.stringify(this.porcentajeDescMax)}`);

    this.totalSale = this.rowItem.reduce((prev, curr) => prev + curr.itemPrice, 0);

  }


  getDescuentoValidator(): ValidatorFn {
    return (c: FormControl) => {

      if (!c.value) {
        return null;
      }

      let desctCalculado: number;
      const errors = {};


      this.rowItem.forEach(rowItem => {

        const desctMax = rowItem.itemPrice * (this.porcentajeDescMax / 100);

        if (this.tipoDescuento === TipoDescuento.porcentaje) {
          desctCalculado = rowItem.itemPrice * (c.value / 100);
        } else {

          const porcentajeRowItem = (rowItem.itemPrice * 100) / this.totalSale;
          desctCalculado = (porcentajeRowItem / 100) * c.value;

        }

        if (desctCalculado > desctMax) {
          errors['descuentoMaximoExcedido'] = { valid: false };
        }

      });

      return errors;

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
    });
  }

  selectRazon(razon) {
    this.razonSeleccionada = razon;
  }


  aplicarDescuentoEnviarSolicitudAutorizacion() {
    const arrDesc: Array<Descuento> = [];

    let importeDescuento = new Decimal(0);
    let itemPrice = new Decimal(0);
    let itemPriceSuma = new Decimal(0);

    if (this.montoDescuento !== null && this.descuentoCodigo !== null) {

      if (this.tipoDescuento === TipoDescuento.porcentaje) {

        this.rowItem.forEach(rowItem => {

          importeDescuento = new Decimal(rowItem.itemPrice).dividedBy(100).times(this.montoDescuento).toDP(2, 1);
          itemPrice = new Decimal(rowItem.itemPrice);

          const descuento: Descuento = new Descuento({
            porcentajeDescuento: Number(this.montoDescuento),
            importeDescuento: importeDescuento.toNumber(),
            tipoDescuento: TipoDescuento.porcentajeTransaccion,
            precioFinal: itemPrice.minus(itemPrice.dividedBy(100).times(this.montoDescuento)).toNumber(),
            codigoRazonDescuento: this.razonSeleccionada.codigoRazon,
            descripcionRazonDescuento: this.razonSeleccionada.descripcionRazon,
            rowIndex: rowItem.rowIndex,
            sku: rowItem.sku
          });

          arrDesc.push(descuento);

          this.autorizacion.sku = rowItem.sku;
          itemPriceSuma = itemPriceSuma.plus(itemPrice);

        });

        this.autorizacion.montoDescuento = ((itemPriceSuma.toNumber() * this.montoDescuento) / 100);

      } else {

        this.rowItem.forEach(rowItem =>{

          //OCG: Asignar los valores para la autorizacion
          this.autorizacion.sku = rowItem.sku;
          itemPriceSuma = itemPriceSuma.plus(rowItem.itemPrice);

          arrDesc.push(this.getDescuentoImporte(rowItem))

        });
        
        this.autorizacion.montoDescuento = this.montoDescuento; // Monto descuento por importe

      }

       //OCG: Asignar los valores para la autorizacion
       this.autorizacion.codigoTienda = 0;
       this.autorizacion.folioVenta = '';
       this.autorizacion.montoVenta = itemPriceSuma;
       this.autorizacion.codigoCaja = 0;
       this.autorizacion.codigoRazonDescuento = this.razonSeleccionada.codigoRazon;
       this.autorizacion.opcionDescuento = 2;
       this.autorizacion.tipoDescuento = this.tipoDescuento;
       this.autorizacion.linea = 0; // Siempre es 0 por que e spor todo el ticket o las partidas del ticket seleccionadas

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
          this._dataTransfer.$applyDiscountTx.next(arrDesc);
          this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: this.codeDescription });
        }

      });
      //this._dataTransfer.$applyDiscountTx.next(arrDesc);
      this.montoDescuento = null;
      this.descuentoCodigo = null;
      this._bsModalRef.hide();

    }
  }



  applyDescuento() {

    const arrDesc: Array<Descuento> = [];

    if (this.montoDescuento !== null && this.descuentoCodigo !== null) {

      if (this.tipoDescuento === TipoDescuento.porcentaje) {

        let importeDescuento = new Decimal(0);
        let itemPrice = new Decimal(0);

        this.rowItem.forEach(rowItem => {

          importeDescuento = new Decimal(rowItem.itemPrice).dividedBy(100).times(this.montoDescuento).toDP(2, 1);
          itemPrice = new Decimal(rowItem.itemPrice);

          const descuento: Descuento = new Descuento({
            porcentajeDescuento: Number(this.montoDescuento),
            importeDescuento: importeDescuento.toNumber(),
            tipoDescuento: TipoDescuento.porcentajeTransaccion,
            precioFinal: itemPrice.minus(itemPrice.dividedBy(100).times(this.montoDescuento)).toNumber(),
            codigoRazonDescuento: this.razonSeleccionada.codigoRazon,
            descripcionRazonDescuento: this.razonSeleccionada.descripcionRazon,
            rowIndex: rowItem.rowIndex,
            sku: rowItem.sku
          });

          arrDesc.push(descuento);

        });


      } else {

        this.rowItem.forEach(rowItem =>
          arrDesc.push(this.getDescuentoImporte(rowItem))
        );

      }

      this._dataTransfer.$applyDiscountTx.next(arrDesc);

      this.montoDescuento = null;
      this.descuentoCodigo = null;
      this._bsModalRef.hide();
    }
  }

  getDescuentoImporte(rowItem: DescuentoRequest): Descuento {

    const montoDescuento = new Decimal(this.montoDescuento);
    const porcentajeRowItem = new Decimal(rowItem.itemPrice).times(100).dividedBy(this.totalSale);
    const descuentoCalculado = porcentajeRowItem.dividedBy(100).times(montoDescuento);


    //console.log('descuento normal => ', descuentoCalculado.toNumber());
    //console.log('descuento truncado => ', descuentoCalculado.toDP(2, 1).toNumber());
    //console.log('descuento redondeado => ', descuentoCalculado.toDP(2).toNumber());

    const descuento: Descuento = new Descuento({
      porcentajeDescuento: porcentajeRowItem.toNumber(),
      importeDescuento: descuentoCalculado.toDP(2).toNumber(),
      tipoDescuento: TipoDescuento.importeTransaccion,
      precioFinal: new Decimal(rowItem.itemPrice).minus(descuentoCalculado).toNumber(),
      codigoRazonDescuento: this.razonSeleccionada.codigoRazon,
      descripcionRazonDescuento: this.razonSeleccionada.descripcionRazon,
      rowIndex: rowItem.rowIndex,
      sku: rowItem.sku
    });


    return descuento;
  }

  cancelDescuento() {
    this.montoDescuento = null;
    this.descuentoCodigo = null;
    this._bsModalRef.hide();

  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GeneralService } from '../../services/general.service';
import { AlertService } from '../../services/alert.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { GetMayoristaMilanoResponseModel } from '../../Models/Sales/GetMayoristaMilanoResponse.model';
import { GetMayoristaRequest } from '../../Models/Sales/GetMayoristaRequest';
import { SalesService } from '../../services/sales.service';
import { EstadoCuentaMayorista } from '../../Models/Sales/EstadoCuentaMayorista.model';
import { ProductsResponseClass } from '../../Models/General/ProductsResponse';
import { ConfigPosService } from '../../services/config-pos.service';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { Decimal } from 'decimal.js/decimal';
import { RowSelectorConfig } from '../../Models/FrontEnd/RowSelectorInterface';
import { RowSelector } from '../../Models/FrontEnd/RowSelector';
import { FocusTicketRowDirective } from '../../directives/focus-ticket-row.directive';
import { ModalFocusDirective } from '../../directives/modal-focus.directive';


@Component({
  selector: 'app-pago-mayorista',
  templateUrl: './pago-mayorista.component.html',
  styleUrls: ['./pago-mayorista.component.css'],
  providers: [GeneralService, SalesService]
})
export class PagoMayoristaComponent implements OnInit, RowSelectorConfig {

  @Input() ticketVirtualInstance: TicketVirtualComponentInterface;
  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;

  busquedaMayoristaForm: FormGroup;
  mayoristaInfo: GetMayoristaMilanoResponseModel;
  showMayoristaEdoCta: boolean;

  estadoCuenta: EstadoCuentaMayorista;
  comisionCalculada: number;
  montoPagar: number;
  montoRecibir: number;

  mayoristas: Array<GetMayoristaMilanoResponseModel> = [];
  itemsPerPage = 5;
  rowSelector: RowSelector;
  totalItemsToPaginate: number;

  constructor(private _generalService: GeneralService, private _dataTransfer: DataTransferService,
              private _alertService: AlertService, private _modalService: BsModalService, public _bsModalRef: BsModalRef,
              private _salesService: SalesService, private _configService: ConfigPosService) {
  }

  seleccionarRowMayorista(mayorista: GetMayoristaMilanoResponseModel, index: number) {
    this.rowSelector.currentSelection = index;
    this.setSelectedItem(mayorista, null);
    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
  }

  setSelectedItem(mayoristaParam: GetMayoristaMilanoResponseModel, index: any): any {
    this.mayoristaInfo = mayoristaParam || this.mayoristas[index];
  }


  onRowEnterAction() {
    this.getMayoristaEdoCta();
  }


  getMayoristaEdoCta() {
    const request = new GetMayoristaRequest({codigoMayorista: this.mayoristaInfo.codigoMayorista, nombre: '', soloActivos: '0'});

    this._salesService.MayoristaDetalleService(request).subscribe(resp => {

      this.showMayoristaEdoCta = true;
      this.mayoristaInfo = resp;
      this.estadoCuenta = resp.estadoCuentaMayorista;

    });
  }


  regresarABusqueda() {
    this.mayoristaInfo = null;
    this.showMayoristaEdoCta = false;
    this.estadoCuenta = null;
    this.montoRecibir = null;

    setTimeout(() => this.modalFocusReference.getElements(), 0);
    setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);
  }

  ngOnInit() {
    this.busquedaMayoristaForm = new FormGroup({
        codigoMayorista: new FormControl(''),
        nombre: new FormControl('')
      }, this.busquedaMayoristaValidator()
    );
    this.comisionCalculada = 0;
  }

  busquedaMayoristaValidator(): ValidatorFn {
    return (c: FormGroup) => {
      let isValid: boolean;
      const controls = c.controls;
      for (const control in controls) {
        if (controls.hasOwnProperty(control) && !isValid) {
          isValid = controls[control].value && controls[control].value.trim() !== '';
        }
      }
      return isValid ? null : {
        almenosuno: {
          valid: false
        }
      };
    };
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  buscarMayorista() {
    if (this.busquedaMayoristaForm.invalid) {
      return;
    }
    const requestMayorista = new GetMayoristaRequest(this.busquedaMayoristaForm.getRawValue());
    this._salesService.MayoristaService(requestMayorista).subscribe(
      resp => {
        if (resp.length) {

          this.totalItemsToPaginate = resp.length;
          this.rowSelector = new RowSelector(this);
          this.mayoristas = resp;


          setTimeout(() => this.modalFocusReference.getElements(), 0);
          setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);


        } else {
          this._alertService.show({mensaje: 'Mayorista no encontrado', tipo: 'warning', titulo: 'Milano'});
        }
      }
    );
  }

  calculaComision() {

    const porcentajeComision = new Decimal(this.mayoristaInfo.porcentajeComision);
    const montoPagar = new Decimal(this.montoPagar);

    this.comisionCalculada = montoPagar.times(porcentajeComision).dividedBy(100).toDP(2, 1).toNumber();
    this.montoRecibir = Number(this.montoPagar);
    this.montoRecibir *= 1 - (Number(this.mayoristaInfo.porcentajeComision) / 100);
  }

  onAceptar() {
    if (this.montoRecibir) {


      const articuloPagoMayorista = new ProductsResponseClass();

      articuloPagoMayorista.articulo.precioConImpuestos = Number(this.montoPagar);
      articuloPagoMayorista.articulo.estilo = 'Pago Cr\u00E9dito';
      articuloPagoMayorista.articulo.isPagoCreditoMayorista = true;
      articuloPagoMayorista.articulo.tasaImpuesto1 = 0;
      articuloPagoMayorista.articulo.sku = this._configService.currentConfig.skuPagoMayorista;


      const articuloComision = new ProductsResponseClass();
      articuloComision.articulo.precioConImpuestos = new Decimal(this.comisionCalculada).neg().toNumber();
      articuloComision.articulo.estilo = 'Comisi\u00F3n Mayorista';
      articuloComision.articulo.tasaImpuesto1 = 0;
      articuloComision.articulo.isPagoComisionCreditomMayorista = true;
      articuloComision.articulo.sku = this._configService.currentConfig.skuPagoComisionMayorista;

      this.ticketVirtualInstance.sendPagoMayorista(this.mayoristaInfo, [articuloPagoMayorista, articuloComision]);


      this._bsModalRef.hide();
    }
  }
}

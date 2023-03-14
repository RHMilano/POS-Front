import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductsResponse } from '../../Models/General/ProductsResponse.model';
import { Msg } from '../../Models/General/alert.model';
import { GeneralService } from '../../services/general.service';
import { PagoServicioResponse } from '../../Models/General/PagoServicioResponse';
import { DataTransferService } from '../../services/data-transfer.service';
import { SalesService } from '../../services/sales.service';
import { PagosServiciosOpciones } from '../../Models/Sales/PagosServiciosOpciones';
import { FormGroup, NgControl, NgForm } from '@angular/forms';
import { ElementoFormaControlService } from '../../services/elemento-forma-control.service';
import { ElementoFormaBase } from '../../Models/General/ElementoFormaBase';
import { Botones } from '../../Models/General/Funciones.model';
import { Articulo } from '../ticket-virtual/articulo/Articulo';
import { TipoElementoFormulario } from '../../shared/GLOBAL';
import { InformacionAdicionalPS } from '../../Models/Sales/PagoServiciosOpciones.model';
import { ProductsResponseClass } from '../../Models/General/ProductsResponse';
import { ConfigPosService } from '../../services/config-pos.service';

@Component({
  selector: 'app-pago-de-servicios',
  templateUrl: './pago-de-servicios.component.html',
  styleUrls: ['./pago-de-servicios.component.css'],
  providers: [GeneralService, SalesService, ElementoFormaControlService]
})
export class PagoDeServiciosComponent implements OnInit {

  Linea: string;
  mensaje: Msg;
  Cantidad: number;
  articulo: ProductsResponse;
  servicios: PagoServicioResponse[];
  convenios: ProductsResponse[];
  SelectServicio: PagoServicioResponse;
  SelectConvenio: any;
  toDisable: boolean;
  selectedConvenio: ProductsResponse;
  procesarFormaDinamica: boolean;
  procesandoFormaDinamica: boolean;
  formaDinamicaIteraccion: InformacionAdicionalPS;

  camposDinamicos: Array<ElementoFormaBase<any>>;
  camposDinamicosCompletos: Array<ElementoFormaBase<any>> = [];
  showFormaDinamica: boolean;
  formDinamica: FormGroup = new FormGroup({});

  callbackKeyUp = this.procesarFormaDin.bind(this);

  createConvevio: boolean;

  constructor(public  modalRef: BsModalRef, private _dataTransfer: DataTransferService,
              private pagoServicio: GeneralService, private _salesService: SalesService
    , private _elementoFormaControlService: ElementoFormaControlService, private _configService: ConfigPosService, private _renderer: Renderer2) {
  }

  ngOnInit() {
    this.cargaServicios();
    this.toDisable = true;
  }

  cargaServicios() {
    this.pagoServicio.PagoServicioService().subscribe(
      data => {
        this.servicios = data.map(x => x);
      }
    );

  }

  cambiaConvenio(event) {
    this.selectedConvenio = event;
  }

  cargarProducto(servicio) {
    const productRequest = '/' + servicio.Codigo;

    this.createConvevio = false;
    this.SelectConvenio = null;
    this.selectedConvenio = null;

    this.pagoServicio.PagoServicioDetalleService(productRequest).subscribe(
      data => {
        this.createConvevio = true;
        this.convenios = data.map(x => x);
      }
    );
  }

  enviarServicio(infoAdicional?: InformacionAdicionalPS) {

    const pagoServicioRequest = new PagosServiciosOpciones({
      skuCode: this.selectedConvenio.articulo.informacionProveedorExternoAsociadaPS.skuCompania,
      cuenta: this.Linea,
      infoAdicional: infoAdicional
    });

    this._salesService.pagoServiciosOpciones(pagoServicioRequest).subscribe(
      resp => {

        const cmpDinamicos = this.camposDinamicosCompletos = this._elementoFormaControlService.getElementsFromResponse(resp);
        const hasSubmit = cmpDinamicos.findIndex(element => element.controlType === TipoElementoFormulario.submit) >= 0;


        if (hasSubmit || this.procesarFormaDinamica) {

          this.camposDinamicos = cmpDinamicos.filter(element => element.controlType !== TipoElementoFormulario.submit).filter(element => !this.formDinamica.controls[element.key]);
          this.procesarFormaDinamica = true;
          this.formaDinamicaIteraccion = resp;

          if (!hasSubmit) {
            this.procesarFormaDinamica = false;
          }


        } else {
          this.camposDinamicos = cmpDinamicos;
          this.camposDinamicosCompletos = cmpDinamicos;
          this.procesarFormaDinamica = false;
        }


        this.showFormaDinamica = true;
        this.procesandoFormaDinamica = false;

      }, err => {
        this.procesandoFormaDinamica = false;
      }
    );
  }


  addPagoServicio() {
    if (this.formDinamica.valid) {
      this.selectedConvenio.articulo.informacionProveedorExternoAsociadaPS.cuenta = this.Linea;
      this.selectedConvenio.articulo.informacionProveedorExternoAsociadaPS.infoAdicional = {
        moduleId: this._elementoFormaControlService.moduleId,
        elementosFormulario: this.camposDinamicosCompletos.map(elemento => {
          elemento.originData.valor = this.formDinamica.controls[elemento.key].value;
          return elemento.originData;
        })
      };

      this.selectedConvenio.articulo = new Articulo(this.selectedConvenio.articulo);
      this.selectedConvenio.articulo.calculaPrecioPagoServicio(Number(this.Cantidad));


      const costoTransaccion = this.selectedConvenio.articulo.informacionProveedorExternoAsociadaPS.infoAdicional.elementosFormulario.find(
        element => element.nombre === 'COSTO_TRANSACCION') || {valor: 0};

      const articuloComision = new ProductsResponseClass();
      articuloComision.articulo.precioConImpuestos = Number(costoTransaccion.valor);
      articuloComision.articulo.estilo = 'Costo transacci\u00F3n';
      articuloComision.articulo.sku = this._configService.currentConfig.skuComisionPagoServicios;
      articuloComision.articulo.codigoImpuesto1 = this._configService.currentConfig.informacionAsociadaImpuestos.codigoImpuesto;
      articuloComision.articulo.tasaImpuesto1 = this._configService.currentConfig.informacionAsociadaImpuestos.porcentajeImpuesto;
      articuloComision.articulo.calculaImpuestoComisionTransaccion();
      articuloComision.articulo.informacionProveedorExternoAsociadaPS = Object.assign({}, this.selectedConvenio.articulo.informacionProveedorExternoAsociadaPS);

      this._dataTransfer.$articuloTicketVirtual.next([this.selectedConvenio, articuloComision]);


      this._dataTransfer.$coordinadorFuncionesBotonera.next({boton: Botones.pagoServicios, action: 'disabled', dontHidde: true});
      this.closeModal();

    }

  }

  closeModal() {
    this.modalRef.hide();
  }

  procesarFormaDin() {

    if (this.formDinamica.invalid) {
      return;
    }

    if (!this.procesarFormaDinamica) {
      this.addPagoServicio();
      return;
    }

    this.formaDinamicaIteraccion.elementosFormulario.forEach(element => {
      if (this.formDinamica.controls[element.nombre]) {
        element.valor = this.formDinamica.controls[element.nombre].value;
      }
    });

    this.camposDinamicos = null;

    this.procesandoFormaDinamica = true;
    this.enviarServicio(this.formaDinamicaIteraccion);
  }


}

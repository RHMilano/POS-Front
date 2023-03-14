import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Compania, CompaniasResponse } from '../../Models/General/Companias';
import { ValidacionTARequest } from '../../Models/Sales/ValidacionTA';
import { GeneralService } from '../../services/general.service';
import { SalesService } from '../../services/sales.service';
import { ProductsResponse } from '../../Models/General/ProductsResponse.model';
import { Msg } from '../../Models/General/alert.model';
import { DataTransferService } from '../../services/data-transfer.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-venta-tiempo-aire',
  templateUrl: './venta-tiempo-aire.component.html',
  styleUrls: ['./venta-tiempo-aire.component.css'],
  providers: [GeneralService, SalesService]
})
export class VentaTiempoAireComponent implements OnInit {


  Numero: number;
  NumeroReal: string;
  articulo: ProductsResponse;
  mensaje: Msg;
  companias: CompaniasResponse[] = [];
  montos: ProductsResponse[] = [];
  Confirmacion: number;
  SelectCompania: any;
  SelectMonto: any;
  toDisable: boolean;

  constructor(public  modalRef: BsModalRef, private tiempoAireService: GeneralService, private fraudValidationService: SalesService,
              private _dataTransfer: DataTransferService, private _alertService: AlertService, public _renderer2: Renderer2) {
  }


  ngOnInit() {
    this.cargaCatalogos();
    this.toDisable = true;
  }


  /**Método para cargar compañias de tiempo aire */
  cargaCatalogos() {
    this.tiempoAireService.TiempoAireService().subscribe(
      data => {
        this.companias = [];
        data.forEach(index => {
          const compania = new Compania(index.Codigo, index.Marca, index.Nombre);
          this.companias.push(compania);
        });
      }
    );
  }

  /**Método para cargar montos de compañia seleccionada */
  cargarMontos(Codigo) {
    const montosRequest = '/' + Codigo;

    this.tiempoAireService.MontosService(montosRequest).subscribe(
      data => {
        this.montos = [];
        data.forEach(index => {
          this.montos.push(index);
        });
      }
    );
  }

  /**Método para validar fraude de compra en tiempo aire*/
  validarFraude() {
    this.toDisable = false;
    if (this.Numero === this.Confirmacion && this.articulo && this.SelectMonto && this.SelectCompania) {
      const validacionTARequest = new ValidacionTARequest();

      validacionTARequest.numeroTelefonico = this.Numero;

      this.articulo.articulo.informacionProveedorExternoTA.numeroTelefonico = this.Numero;

      this.fraudValidationService.FraudValidationService(validacionTARequest).subscribe(
        data => {
          if (Number(data.codeNumber) === 300) {
            /**Se envia articulo de compra en tiempo aire a ticket virtual*/
            this._dataTransfer.$articuloTicketVirtual.next(this.articulo);
            this.closeModal();
          } else {
            this._alertService.show({tipo: 'info', titulo: 'Mensaje', mensaje: data.codeDescription});
            this.closeModal();
            this.toDisable = true;
          }
        }
      );
    }
  }

  /**Método para guardar en variable articulo de tiempo aire a comprar */
  enviarSku(seleccion: string) {
    this.montos.forEach(index => {
      if (index.articulo.sku === Number(seleccion)) {
        this.articulo = index;
      }
    });
  }

  /**Método para cerrar el diálogo de tiempo aire*/
  closeModal() {
    this.modalRef.hide();
  }

  changeNumber(event) {
    if (String(this.Numero).length === 10) {
      this.NumeroReal = '***********';
    } else {
      this.NumeroReal = '';
      this.Numero = null;
    }

  }

  changeNumberReal(event) {
    if (this.NumeroReal === '*') {
      this.Numero = null;
    }

  }
}

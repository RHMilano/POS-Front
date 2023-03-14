import {ChangeDetectorRef, Component, ElementRef, KeyValueDiffers, OnInit, QueryList, SkipSelf, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {InicioFinDiaService} from '../../../services/inicio-fin-dia.service';
import {CashOutResponse} from '../../../Models/InicioFin/CashOutResponse';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {RelacionCajaComponent} from '../relacion-caja/relacion-caja.component';

@Component({
  selector: 'app-cash-out',
  templateUrl: './cash-out.component.html',
  styleUrls: ['./cash-out.component.css'],
  providers: [ InicioFinDiaService ],
  encapsulation:  ViewEncapsulation.None
})
export class CashOutComponent implements OnInit {

  rows;
  cashOut: CashOutResponse;
  @ViewChild('myTable') table: DatatableComponent;
  @ViewChildren('tabRef') tabRefs: QueryList<ElementRef>;
  tableSelect: number;
  cajas;

  constructor(private _iniciofinService: InicioFinDiaService, private modalRef: BsModalRef, public modalService: BsModalService) { }

  ngOnInit() {
    this.cargaCashOut();
  }

  cargaCashOut () {
    this.cajas = [];
      this._iniciofinService.cashOutService().subscribe( response => {
          if(response) {
            this.cashOut = response;
            this.rows = response.cashOutCaja;
            this.selecTable(0);
          }
      });
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  selecTable(index) {
    this.tableSelect = index;
    this.cajas = this.rows[index].lecturasZ
  }


  actualizarCashOut() {
    this.cashOut.cashOutCaja = this.rows;
    this._iniciofinService.actualizarCashOutService(this.cashOut).subscribe( response => {
      if(response) {
        this.closeModal();
        const initialState = { relacionCaja: response};
        const options: ModalOptions = {
          class: 'modal-max',
          backdrop: 'static',
          keyboard: false,
          initialState
        };
        this.modalRef = this.modalService.show(RelacionCajaComponent, options);
      }
      });
  }

  closeModal() {
    this.modalRef.hide();
  }



}

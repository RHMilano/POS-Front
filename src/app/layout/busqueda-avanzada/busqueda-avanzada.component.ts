import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  BusquedaAvanzadaRequest,
  BusquedaAvanzadaRespose,
  CatalogosArticulos,
  CatalogosRequest,
  SelectedParams
} from '../../Models/General/BusquedaAvanzada.model';
import 'rxjs/add/observable/of';
import { GeneralService } from '../../services/general.service';
import { MsgService } from '../../services/msg.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { DataTransferService } from '../../services/data-transfer.service';
import { AlertService } from '../../services/alert.service';
import { NgForm } from '@angular/forms';
import { RowSelectorConfig } from '../../Models/FrontEnd/RowSelectorInterface';
import { RowSelector } from '../../Models/FrontEnd/RowSelector';
import { ModalFocusDirective } from '../../directives/modal-focus.directive';
import { FocusTicketRowDirective } from '../../directives/focus-ticket-row.directive';
import { RowSelectorBackPaginate } from '../../Models/FrontEnd/RowSelectorBackPaginate';
import {Observable} from 'rxjs/Observable';
import {TypeaheadDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-busqueda-avanzada',
  templateUrl: './busqueda-avanzada.component.html',
  styleUrls: ['./busqueda-avanzada.component.css'],
  providers: [GeneralService]
})

export class BusquedaAvanzadaComponent implements OnInit, RowSelectorConfig {
  @ViewChild('formaBusqueda') formaBusqueda: NgForm;
  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;
  @ViewChild('skuBusq') skuBusq: ElementRef;
  @ViewChild('typeahead') typeahead: TypeaheadDirective;

  catRequest: CatalogosRequest;
  sp: SelectedParams;
  catalogos: CatalogosArticulos;
  currentData: BusquedaAvanzadaRespose;
  p = 1;
  currentSearch: BusquedaAvanzadaRequest;


  rowSelector: RowSelector;
  itemsPerPage = 2;
  totalItemsToPaginate: number;

  currentPage = 1;

  dataSource: Observable<any>;

  constructor(private catalogosService: GeneralService
    , private _msg: MsgService
    , private modalRef: BsModalService
    , private _dataTransfer: DataTransferService
    , private _alertService: AlertService) {
    this.dataSource = Observable.create((observer: any) => {
       observer.next(this.sp.estilo.descripcion);
    }).mergeMap((token: string) => this.getStatesAsObservable(token));
  }


  ngOnInit() {
    this.sp = new SelectedParams();
    this.catRequest = new CatalogosRequest();
    this.catalogos = new CatalogosArticulos();
    this.currentData = new BusquedaAvanzadaRespose();
    this.currentData.numeroRegistros = 0;
    this.getCatalogos('proveedor');
    this.getCatalogos('departamento');
  }

  getStatesAsObservable(token: string): Observable<any> {
    let query =  new RegExp('^'+token);
    return Observable.of(
      this.catalogos.estilo.filter(estilo => {
        return query.test(estilo.descripcion);
      })
    );
  }

  closeModal() {
    this.currentData = new BusquedaAvanzadaRespose();
    this.currentData.numeroRegistros = 0;
    this.currentData.productos = null;
    this.modalRef.hide(1);
  }


  getCatalogos(tipo: string) {

    this.catalogos[tipo] = [];
    this.catalogosService.GetCatalogosService(this.catRequest, tipo).subscribe(
      data => {
        data.forEach(index => {
          this.catalogos[tipo].push({
            id: index.codigo,
            descripcion: index.descripcion
          });
        });
      });

  }

  typeSelector(dinamico) {
    let tipo = '';
    const skuPattern = new RegExp('^\\d{9}([A-za-z]{1})?$');
    const upcPattern = new RegExp('^\\d{16}$');

    if (dinamico.match(skuPattern)) {
      tipo = 'sku';
    } else if (dinamico.match(upcPattern)) {
      tipo = 'upc';
    } else {
      tipo = 'description';
    }

    return tipo;
  }

  changeTypeaheadLoading(event) {
    console.log(event)
  }

  onSelectOption(event: TypeaheadMatch, tipo: string) {


      const item = Object.assign({}, event.item);

      switch (tipo) {
        case 'proveedor':
          this.sp.proveedor = item;
          this.catRequest.proveedor = item.id;
          this.getCatalogos('estilo');
          break;
        case 'estilo':
          this.sp.estilo = item;
          this.catRequest.estilo = item.id;
          break;
        case 'departamento':
          this.sp.departamento = item;
          this.catRequest.departamento = item.id;
          this.getCatalogos('subdepartamento');
          break;
        case 'subdepartamento':
          this.sp.subdepartamento = item;
          this.catRequest.subdepartamento = item.id;
          this.getCatalogos('clase');
          break;
        case 'clase':
          this.sp.clase = item;
          this.catRequest.clase = item.id;
          this.getCatalogos('subclase');
          break;
        case 'subclase':
          this.sp.subclase = item;
          this.catRequest.subclase = item.id;
          break;
      }

  }

  limpiar() {
    this.formaBusqueda.form.reset();
    this.sp = new SelectedParams();
    this.currentData = new BusquedaAvanzadaRespose();
    this.catalogos.reset();
    this.currentData.numeroRegistros = 0;
    this.setFocusInput();
  }

  catChange(value: string, catName: string) {

    if (!this.catalogos[catName]) {
      this.sp[catName] = {id: value, descripcion: value};
    } else {
      const textedValue = this.catalogos[catName].find(cat => cat.descripcion !== '' && (cat.descripcion === value));
      this.sp[catName] = textedValue || {id: !!value ? -1 : 0, descripcion: value};
    }


    if (catName === 'proveedor') {
      this.sp['estilo'] = {id: '0', descripcion: ''};
      this.catalogos['estilo'] = [];
      this.formaBusqueda.controls['estilo'].setValue('');
    }


    if (catName === 'departamento') {
      this.sp['subdepartamento'] = {id: 0, descripcion: ''};
      this.catalogos['subdepartamento'] = [];
      this.formaBusqueda.controls['subdepartamento'].setValue('');
    }

    if (catName === 'clase') {
      this.sp['subclase'] = {id: 0, descripcion: ''};
      this.catalogos['subclase'] = [];
      this.formaBusqueda.controls['subclase'].setValue('');
    }
  }


  onSubmit() {
    this.p = 1;
    const busquedaRequest = new BusquedaAvanzadaRequest();
    busquedaRequest.codeProvider = this.sp.proveedor.id;
    busquedaRequest.codigoEstilo = this.sp.estilo.id.toString();
    busquedaRequest.codeDepartment = this.sp.departamento.id;
    busquedaRequest.codeSubDepartment = this.sp.subdepartamento.id;
    busquedaRequest.codeClass = this.sp.clase.id;
    busquedaRequest.codeSubClass = this.sp.subclase.id;
    busquedaRequest.sku = this.sp.sku;
    // busquedaRequest.upc = this.sp.upc;
    busquedaRequest.numeroPagina = this.currentPage;
    busquedaRequest.registrosPorPagina = this.itemsPerPage;
    this.currentSearch = busquedaRequest;

    this.catalogosService.AdvancedSearchService(busquedaRequest).subscribe(data => {
      if (data.numeroRegistros === 0) {
        this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Art\u00EDculo no encontrado'});
      }

      this.setPager(data);
    });

    if(this.sp.sku) {
      this.sp.sku = '';
      this.setFocusInput();
    }
  }

  getPage(page: number) {
    this.currentSearch.numeroPagina = page;
    this.currentPage = page;
    this.catalogosService.AdvancedSearchService(this.currentSearch).subscribe(data => {
      this.setPager(data);
    });
  }


  setPager(data: BusquedaAvanzadaRespose) {

    this.totalItemsToPaginate = data.numeroRegistros;
    this.rowSelector = new RowSelectorBackPaginate(this);
    this.rowSelector.pageNumber = this.currentPage;
    this.currentData = data;

    if (data.numeroRegistros > 0) {
      setTimeout(() => this.modalFocusReference.getElements(), 0);
      setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);
    }
  }

  setFocusInput() {
    setTimeout(() => {
      this.skuBusq.nativeElement.focus();
    }, 1100);
  }

  setSelectedItem(selectedItem: any, index: any): any {

    if (this.rowSelector.pageNumber !== this.currentPage) {
      this.currentPage = this.rowSelector.pageNumber;
      this.getPage(this.currentPage);
    } else {

      this.rowSelector.currentSelection = index;
      setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
    }


  }
}

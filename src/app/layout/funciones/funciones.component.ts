import { AfterViewInit, Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GLOBAL, tipoCapturaLuz, TipoCorte } from '../../shared/GLOBAL';
import { Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs/Subscription';
import { BotoneraPeticion, Botones } from '../../Models/General/Funciones.model';
import { FuncionesBtnHandler } from './FuncionesBtnHandlers';
import { ConfiguracionBoton } from '../../Models/General/ConfiguracionBoton';
import { ReimpresionTicketComponent } from '../reimpresion-ticket/reimpresion-ticket.component';
import { RetiroParcialEfectivoComponent } from '../retiro-parcial-efectivo/retiro-parcial-efectivo.component';
import { RetiroEgresosComponent } from '../retiro-egresos/retiro-egresos.component';
import { PostAnulacionComponent } from '../post-anulacion/post-anulacion.component';
import { CashBackAdvancedComponent } from '../cash-back-advanced/cash-back-advanced.component';
import { LecturaXComponent } from '../lectura-x/lectura-x.component';
import { MenuButtonPaginator } from './MenuButtonPaginator';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { SalesService } from '../../services/sales.service';
import { AlertService } from '../../services/alert.service';
import { GeneralService } from '../../services/general.service';
import { CapturaLuzRequest } from '../../Models/InicioFin/CapturaLuzRequest';
import { CapturaLuzComponent } from '../captura-luz/captura-luz.component';
import { AutenticacionOfflineComponent } from '../autenticacion-offline/autenticacion-offline.component';
import { FinDiaComponent } from '../fin-dia/fin-dia.component';
import { InicioFinDiaService } from '../../services/inicio-fin-dia.service';
import { LoginComponentInterface } from '../../Models/FrontEnd/LoginComponentInterface';

@Component({
  selector: 'app-funciones',
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.css'],
  providers: [SalesService, GeneralService, InicioFinDiaService]
})
export class FuncionesComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() btnsConfig: Array<ConfiguracionBoton>;
  hideContainer = false;
  inEnd = false;
  currentPage = 1;
  showingChilds = false;
  childTitle = '';
  itemsPerPage = 5;
  modalRef: BsModalRef;
  funcionesEnabled = true;
  modalSubscriptions: Subscription[] = [];
  functionSelcSub;
  funcionesBotoneraSwitchSub;
  ticketVirtualInstance: TicketVirtualComponentInterface;
  handlersCat = FuncionesBtnHandler;
  toolTipTmpl: string;
  funcionesToRender: Array<ConfiguracionBoton> = [];
  ticketVirtualInstanceSub;
  buttonsPaginator: MenuButtonPaginator;
  loginSub;
  loginInstance: LoginComponentInterface;

  constructor(public _router: Router, private _generalService: GeneralService,
              public _dataTransfer: DataTransferService, private _iniciofinService: InicioFinDiaService,
              public modalService: BsModalService, private _salesService: SalesService, private _alertService: AlertService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {btnsConfig: {currentValue: btnChanges}, btnsConfig: {firstChange: firstChange}} = changes;

    if (btnChanges) {
      this.buttonsPaginator = new MenuButtonPaginator(this.btnsConfig, 0);

      if (!firstChange) {
        this.ngAfterViewInit();
      }
    }

  }


  ngAfterViewInit(): void {
    setTimeout(() => this.ticketVirtualInstance.bloqueoBotonesAfterBotonera());
  }


  ngOnDestroy(): void {
    this.modalSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });

    this.functionSelcSub.unsubscribe();
    this.funcionesBotoneraSwitchSub.unsubscribe();
    this.ticketVirtualInstanceSub.unsubscribe();
    this.loginSub.unsubscribe();
  }

  ngOnInit() {

    this.modalSubscriptions.push(this.modalService.onHidden.subscribe(($event: any, reason: string) => {
      this.modalRef = null;
      this.fnSwitch(true);
    }));
    this.modalSubscriptions.push(this.modalService.onShow.subscribe(($event: any, reason: string) => {
      this.fnSwitch(false);
    }));
    this.functionSelcSub = this._dataTransfer.$coordinadorFuncionesBotonera.subscribe(tipo => {
      this.selectOperation(tipo);
    });
    this.funcionesBotoneraSwitchSub = this._dataTransfer.$funcionesBotoneraSwitch.subscribe(estado => {
      this.fnSwitch(estado);
    });

    this.loginSub = this._dataTransfer.$loginInstance.subscribe(
      loginInstance => this.loginInstance = loginInstance
    );

    this.ticketVirtualInstanceSub = this._dataTransfer.$ticketVirtualInstance.subscribe(
      ticketVirtualInstance => this.ticketVirtualInstance = ticketVirtualInstance
    );

    this.handlersCat.pageControl = () => {
      this.funcionesToRender = this.buttonsPaginator.pageControl();
    };

    this.handlersCat.chilsControl = (btn: ConfiguracionBoton) => {
      this.funcionesToRender = this.buttonsPaginator.chilsControl();
    };
  }

  getLevel(level: number) {
    this.funcionesToRender = this.buttonsPaginator.getLevel(level);
  }

  showItems(pageNumber: number) {
    this.funcionesToRender = this.buttonsPaginator.getPage(pageNumber);
  }

  showChild(conf: ConfiguracionBoton) {

    this.funcionesToRender = new Array();
    conf.mostrandoHijos = true;
    this.buttonsPaginator.setConfig(conf);
    this.showItems(1);
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {

    const keyCode = event.which || event.keyCode;

    if (this.funcionesEnabled) {
      if (keyCode === 39) {
        this.funcionesToRender = this.buttonsPaginator.pageFordward();
      } else if (keyCode === 37) {
        this.funcionesToRender = this.buttonsPaginator.pageBackwards();
      } else if (keyCode === 27) {
        this.funcionesToRender = this.buttonsPaginator.chilsControl();
      }

      const keyToFind = event.altKey ? `ALT + ${event.code}` : event.code;
      const btnToHandle = this.buttonsPaginator.getAllCurrentLevel().find(btn => btn.teclaAccesoRapido.toUpperCase() === keyToFind && btn.habilitado);

      if (btnToHandle) {
        this.funcionesToRender = this.buttonsPaginator.getPageOfButton(btnToHandle);
        this.handlersCat[btnToHandle.handler].bind(this)(btnToHandle);
      }

    }
    const preventDefaults = ['112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123'];
    if ((event.which || event.keyCode) && GLOBAL.includesAny((event.which || event.keyCode).toString(), preventDefaults)) {
      event.preventDefault();
    }
  }

  selectOption(item: ConfiguracionBoton) {
    
   

    if (this.funcionesEnabled && item.habilitado) {
      this.hideContainer = true;
      this.handlersCat[item.handler].bind(this)(item);
    }
  }

  selectOperation(tipo: BotoneraPeticion) {

    const status = tipo.action === 'enabled' ? true : false;
    const visible = tipo.dontHidde ? true : false;

    switch (tipo.boton) {
      case Botones.reset:
        this.childTitle = '';
        this.btnsConfig.forEach(btn => btn.resetConfig());
        this.showItems(1);
        break;

      case Botones.blockAll:
        this.btnsConfig.forEach(btn => btn.habilitado = false);
        break;
      default:

        let btnEncontrado: ConfiguracionBoton = null;

        this.btnsConfig.some(btn => {
          if (btn.identificador === tipo.boton) {
            btnEncontrado = btn;
            return true;
          } else {
            const btnTmp = btn.findChild(tipo.boton);
            if (btnTmp) {
              btnEncontrado = btnTmp;
              return true;
            }
          }
          return false;
        });

        if (btnEncontrado) {

          btnEncontrado.habilitado = btnEncontrado.configOriginal.habilitado && status;
          btnEncontrado.visible = btnEncontrado.configOriginal.visible && visible;

          if (btnEncontrado.btnParent && btnEncontrado.btnParent.mostrandoHijos) {
            this.showChild(btnEncontrado.btnParent);
          } else {
            this.getLevel(0);

          }

        } else {
          this.getLevel(0);
        }


        break;
    }
  }

  fnSwitch(estado: boolean) {
    this.funcionesEnabled = estado;
  }

  setTextToolTip(item) {
    this.toolTipTmpl = item.tooltip;
  }

  sudoReimpresionTicket() {
    const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta};
    const options: ModalOptions = {
      class: 'modal-lg',
      backdrop: 'static',
      initialState
    };
    this.modalRef = this.modalService.show(ReimpresionTicketComponent, options);
  }

  sudoRetiroEfectivo() {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static'
    };
    this.modalRef = this.modalService.show(RetiroParcialEfectivoComponent, options);
  }

  sudoEgresos() {
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static'
    };
    this.modalRef = this.modalService.show(RetiroEgresosComponent, options);
  }

  sudoLecturaX() {
    const initialState = {TipoCorte: TipoCorte.corteX};
    const options: ModalOptions = {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
      initialState
    };
    this.modalRef = this.modalService.show(LecturaXComponent, options);
  }

  sudoCashBack() {

    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false
    };
    this.modalRef = this.modalService.show(CashBackAdvancedComponent, options);
  }

  sudoPostAnulacion() {
    const initialState = {TipoVenta: this.ticketVirtualInstance.tipoVenta};
    const options: ModalOptions = {
      class: 'modal-lg',
      initialState
    };
    this.modalRef = this.modalService.show(PostAnulacionComponent, options);
  }

  sudoCargaLlaves() {
    this._salesService.cargarLlaves().subscribe(
      resp => {
        this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: resp.codeDescription});
      }
    );
  }

  inicioDia() {
    const initialState = {tipoCapturaLuz: tipoCapturaLuz.inicio, loginInstance: this.loginInstance};
    const options: ModalOptions = {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState
    };
    this._iniciofinService.inicioDiaService().subscribe(
      resp => {
        if (resp.inicioDiaPermitido) {
          if (resp.requiereAutenticacionOffline) {
            const initialState = {tipoCapturaLuz: tipoCapturaLuz.inicio, loginInstance: this.loginInstance, fecha: resp.fechaOperacion, folio: resp.folioOperacion};
            const options: ModalOptions = {
              class: 'modal-md',
              backdrop: 'static',
              keyboard: false,
              initialState
            };
            this.modalRef = this.modalService.show(AutenticacionOfflineComponent, options);
          } else {
            const initialState = {tipoCapturaLuz: tipoCapturaLuz.inicio, loginInstance: this.loginInstance};
            const options: ModalOptions = {
              class: 'modal-md',
              backdrop: 'static',
              keyboard: false,
              initialState
            };
            if (resp.requiereCapturarLuz) {
              this.modalRef = this.modalService.show(CapturaLuzComponent, options);
            } else {
              const requestCaptura = new CapturaLuzRequest();
              requestCaptura.valorLectura = 0;
              this._iniciofinService.capturaLuzService(requestCaptura).subscribe(
                resp => {
                  if (Number(resp.codeNumber) === 400) {
                    this._alertService.show({tipo: 'success', titulo: 'Milano', mensaje: resp.codeDescription});
                    this.loginInstance.getConfig().then().catch(
                      () => {
                      });
                  } else {
                    this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: resp.codeDescription});
                  }
                });
            }
          }
        } else {
          this._alertService.show({titulo: 'Milano', tipo: 'info', mensaje: resp.mensajeAsociado});
        }
      });
  };

  finDia() {
    this._iniciofinService.finDiaService().subscribe(
      resp => {
        if (resp) {
          const initialState = {
            capturaLuz: resp.requiereCapturarLuz,
            capturaLuzInicio: resp.requiereCapturarLuzInicioDia,
            validacionCajas: resp.resultadosValidacionesCajas,
            validacionCajasEjec: resp.finDiaPermitido
          };
          const options: ModalOptions = {
            class: 'modal-lg',
            backdrop: 'static',
            keyboard: false,
            initialState
          };
          this.modalRef = this.modalService.show(FinDiaComponent, options);
        } else {
          this._alertService.show({titulo: 'Milano', tipo: 'info', mensaje: resp.mensajeAsociado});
        }
      });
  }

}

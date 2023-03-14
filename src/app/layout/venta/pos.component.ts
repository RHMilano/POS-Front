import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { MsgService } from '../../services/msg.service';
import { ConfigPosService } from '../../services/config-pos.service';
import { AuthService } from '../../services/auth.service';
import { UserResponse } from '../../Models/Security/User.model';
import { DataTransferService } from '../../services/data-transfer.service';
import { GLOBAL } from '../../shared/GLOBAL';
import { ShowPagosRequest } from '../../Models/Pagos/Pagos.model';
import { BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ConfiguracionBoton } from '../../Models/General/ConfiguracionBoton';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { DescuentoPromocionalVentaModel } from '../../Models/Pagos/DescuentoPromocionalVenta.model';
import { AlertService } from '../../services/alert.service';
import { environment as env, environment } from '../../../environments/environment';
import { HttpBackend } from '@angular/common/http';
import { CambiarPasswordComponent } from '../cambiar-password/cambiar-password.component';

@Component({
  selector: "app-venta",
  templateUrl: "./pos.component.html",
  styleUrls: ["./pos.component.css"],
  providers: [GeneralService],
})
export class PosComponent implements OnInit, OnDestroy, AfterViewInit {
  loggedInfo: UserResponse;
  fechaHoy = new Date();
  pagoSub;
  configSub;
  showPagos = false;
  currentTotalizar: ShowPagosRequest = new ShowPagosRequest();
  ticketVirtualInstance: TicketVirtualComponentInterface;
  ticketVirtualSub;
  detalleProductoSub;
  itemEstilo;
  itemSku;
  itemPrice = 0;
  itemImageUrl: string = "assets/images/producto.png";
  btnsConfig: Array<ConfiguracionBoton> = [];
  promocionesAplicadas: Array<DescuentoPromocionalVentaModel> = [];

  popOver: boolean;
  _posversion: string; //OCG: Número de versión de los enviroments

  constructor(
    private _generalService: GeneralService,
    private _msg: MsgService,
    public _configService: ConfigPosService,
    private renderer: Renderer2,
    private _authService: AuthService,
    private _dataTransfer: DataTransferService,
    private _modalService: BsModalService,
    private _alertService: AlertService
  ) {
    this.renderer.removeClass(document.body, "image-background-1");
    this.renderer.addClass(document.body, "bg-fondo");

    this._posversion = env.posversion; //OCG: Número de versión de los enviroments
  }

  ngAfterViewInit(): void {
    this.configSub = this._configService.configLoaded$.subscribe((config) => {
      //console.log(`aaron ${JSON.stringify(config)} `);
      if (config.posModoConsulta) {
        this._alertService.getElements();
      } else {
        const elements = Array.prototype.slice.call(
          document.querySelectorAll("INPUT, BUTTON,SELECT,A, .btn_funcion")
        );
        elements.forEach((elem) => {
          if (!elem.hasAttribute("hidden")) {
            elem.setAttribute("wasDisabled", "false");
          }
        });
        this._alertService.unBlockElements();
        this.ticketVirtualInstance.focusOnSkuInput();
      }

      this.btnsConfig = this._configService.btnsConfig;
    });
  }

  logout() {
    if (this.ticketVirtualInstance.$articuloAgregado.getValue()) {
      this.ticketVirtualInstance.cancelarTicket(false, true);
    } else {
      this._authService.logout();
    }
  }

  ngOnDestroy(): void {
    this.pagoSub.unsubscribe();
    this.detalleProductoSub.unsubscribe();
    this.ticketVirtualSub.unsubscribe();
    this.configSub.unsubscribe();
  }

  ngOnInit() {
    this.loggedInfo = JSON.parse(localStorage.getItem('accessInfo'));
    this._authService.loggedInfo.next(this.loggedInfo);

    if (this.loggedInfo.vencioPassword !== 0) {
      this._alertService.show({ tipo: 'warning', mensaje: 'Tu contraseña esta por expirar!. \n Cámbiala pronto para no ser bloqueado del sistema.', titulo: 'Contraseña' });
      // this._msg.setMsg({ tipo: 'info', message: 'Tu contraseña esta por expirar !!. \n Cambiala pronto para no ser bloqueado del sistema.' });

      setTimeout(() => {
        const options: ModalOptions = {
          class: 'modal-md',
          backdrop: 'static'
          // initialState: {authorized: true}
        };

        if (confirm('\n MILANO \n\n ¿ Cambiar contraseña ahora ?')) {
          this._modalService.show(CambiarPasswordComponent, options);
        } else { }
      }, 2500);
    }

    var splitted = this.loggedInfo.nombre.split(",", 2);
    this.loggedInfo.nombre = splitted[1];
    this.loggedInfo.numeroTienda = splitted[0];

    this.btnsConfig = this._configService.btnsConfig;

    //this.btnsConfig.forEach(btn => btn.resetConfig());

    this.pagoSub = this._dataTransfer.$showFormasPago.subscribe(toReque => {
      if (toReque !== undefined && toReque !== null && ((toReque.totalizarInfo !== undefined && toReque.totalizarInfo.folioOperacion !== '')
        || (toReque.totalizarApartado !== undefined && toReque.totalizarApartado.folioOperacion !== ''))) {
        this.showPagos = true;
        this.currentTotalizar = toReque;
      } else {
        this.currentTotalizar = null;
        this.showPagos = false;
        this.btnsConfig.forEach(btn => btn.resetConfig());
      }

      this.promocionesAplicadas = this.ticketVirtualInstance.ticketVirtual.ticketDescuentos.getPromocionesAplicadasTotalizar();

    });

    //console.log('Antes de entrar en   this.detalleProductoSub')
    this.detalleProductoSub = this._dataTransfer.$detalleProducto.subscribe(detalle => {
      if (!detalle) {
        return;
      }

      this.itemSku = detalle.itemSku;
      this.itemEstilo = detalle.itemEstilo;
      this.itemPrice = detalle.itemPrice;

      if (!!detalle.itemImageUrl) {
        this.itemImageUrl = detalle.itemImageUrl;
      } else {
        this.getArticuleImage(detalle.rutaImagenLocal, detalle.rutaImagenRemota);
      }

      //console.log(`detalle.itemImageUrl: ${detalle.itemImageUrl}` );

    });


    this.ticketVirtualSub = this._dataTransfer.$ticketVirtualInstance.subscribe(instance => this.ticketVirtualInstance = instance);


  }


  // ngOnInit() {
  //   this.loggedInfo = JSON.parse(localStorage.getItem("accessInfo"));
  //   this._authService.loggedInfo.next(this.loggedInfo);

  //   var splitted = this.loggedInfo.nombre.split(",", 2);
  //   this.loggedInfo.nombre = splitted[1];
  //   this.loggedInfo.numeroTienda = splitted[0];

  //   this.btnsConfig = this._configService.btnsConfig;

  //   //this.btnsConfig.forEach(btn => btn.resetConfig());

  //   this.pagoSub = this._dataTransfer.$showFormasPago.subscribe((toReque) => {
  //     if (
  //       toReque !== undefined &&
  //       toReque !== null &&
  //       ((toReque.totalizarInfo !== undefined &&
  //         toReque.totalizarInfo.folioOperacion !== "") ||
  //         (toReque.totalizarApartado !== undefined &&
  //           toReque.totalizarApartado.folioOperacion !== ""))
  //     ) {
  //       this.showPagos = true;
  //       this.currentTotalizar = toReque;
  //     } else {
  //       this.currentTotalizar = null;
  //       this.showPagos = false;
  //       this.btnsConfig.forEach((btn) => btn.resetConfig());
  //     }

  //     this.promocionesAplicadas = this.ticketVirtualInstance.ticketVirtual.ticketDescuentos.getPromocionesAplicadasTotalizar();
  //   });

  //   // OCG: Validación de las imágenes
  //   this.detalleProductoSub = this._dataTransfer.$detalleProducto.subscribe(
  //     (detalle) => {

  //       if (!detalle) {
  //         return;
  //       }

  //       //console.log(`Detalle del SKU: ${JSON.stringify(detalle)}`);

  //       this.itemSku = detalle.itemSku;
  //       this.itemEstilo = detalle.itemEstilo;
  //       this.itemPrice = detalle.itemPrice;

  //       if (!!detalle.itemImageUrl) {
  //         this.itemImageUrl = detalle.itemImageUrl;
  //       } else {
  //         this.getArticuleImage(detalle.rutaImagenLocal, detalle.rutaImagenRemota);
  //       }
  //     }
  //   );

  //   this.ticketVirtualSub = this._dataTransfer.$ticketVirtualInstance.subscribe(
  //     (instance) => (this.ticketVirtualInstance = instance)
  //   );
  // }



  getArticuleImage(rutaLocal: string, rutaRemota: string) {

    GLOBAL.fileExists(rutaLocal).then(
      url => this.itemImageUrl = url
    ).catch(
      () => {
        this.itemImageUrl = rutaRemota;
        this._generalService.AlmacenarImagenRemota({url: rutaRemota}).subscribe();
      }
    );

  }

  // getArticuleImage(rutaLocal: string, rutaRemota: string) {
  //   let siLocal: boolean ;
  //   let siGuardar: boolean = true;
  //   //itemImageUrl:string = "assets/images/producto.png";
  //   //this.itemImageUrl = 'http://192.168.2.79/showroom/images3/thumbs/F00101363520s.jpg';

  //   console.log(`Buscar: ${rutaLocal}`)

  //   // if(rutaLocal){
  //   //   var req = new XMLHttpRequest();
  //   //   req.open('GET', rutaLocal, false);
  //   //   req.send();
  //   //   console.log(`Buscar: ${ req.status}`)
  //   //   if(req.status!=200){
  //   //     console.log('No se encontro la imagen');
  //   //     siLocal = false;
  //   //   };
  //   // }

  //   if(rutaRemota){
  //     var req2 = new XMLHttpRequest();
  //     req2.open('GET', rutaRemota, false);
  //     req2.send();
  //     console.log(`Buscar remoto: ${ req2.status}`)
  //     if(req2.status!=200){
  //       console.log('No se encontro la imagen');
  //       siLocal = false;
  //     };
  //   }

  // }





  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode;

    if (keyCode === 8) {
      const target = <HTMLInputElement>event.target;

      if (target.nodeName !== "INPUT" && target.nodeName !== "SELECT") {
        event.preventDefault();
      }
    }

    if (
      keyCode === 27 &&
      this.showPagos &&
      this._modalService.getModalsCount() === 0 &&
      !this._alertService.activeRequests.length
    ) {

      this.ticketVirtualInstance.FormasPagoInstance.cancelarVenta();
    }
  }

  @HostListener("document:contextmenu", ["$event"])
  handleMouseClick(event: KeyboardEvent) {
    event.preventDefault();
  }
}

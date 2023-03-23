import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { ConsultaLealtadRequest } from '../../Models/Lealtad/consulta_lealtad_request';
import { ConsultaLealtadResponse } from '../../Models/Lealtad/consulta_lealtad_response';
import { RegistroLealtadRequest } from '../../Models/Lealtad/registro_lealtad_request';
import { RegistroLealtadResponse } from '../../Models/Lealtad/registro_lealtad_response';
import { UserResponse } from '../../Models/Security/User.model';
import { REGEX } from '../../Regex/validaciones.regex';
import { AlertService } from '../../services/alert.service';
import { LealtadService } from '../../services/lealtad.service';
import { TicketVirtual } from '../ticket-virtual/TicketVirtual';

@Component({
  selector: 'app-ticket-virtual-buscar-lealtad',
  templateUrl: './ticket-virtual-buscar-lealtad.component.html',
  styleUrls: ['./ticket-virtual-buscar-lealtad.component.css'],
  providers: [LealtadService]
})
export class TicketVirtualBuscarLealtadComponent implements OnInit {

  @Input('ticketVirtualInstance') ticketVirtualInstance: TicketVirtualComponentInterface;
  
  nuevoPrecioItem: number;
  numeroCliente: number;
  // razones: Array<ReasonsCodesTransactionResponse>;
  SelectRazon;
  condigoSeleccionado: number;
  bolNuevoCliente: boolean = false;
  frm: FormGroup;
  frmConsulta: FormGroup;
  regex = REGEX; // Constante array con las expresiones regulares utilizadas
  registroLealtadRequest: RegistroLealtadRequest;
  registroLealtadResponse: RegistroLealtadResponse;
  consultaLealtadRequest: ConsultaLealtadRequest;
  consultaLealtadResponse: ConsultaLealtadResponse;
  seleccion: ConsultaLealtadResponse;
  numeroClienteGenerado: string;
  loggedInfo: UserResponse;
  showButtons:boolean = false;
  fecha = new Date();
 

  constructor(
    public _bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _lealtadService: LealtadService) {
    this.registroLealtadRequest = new RegistroLealtadRequest();
    this.registroLealtadResponse = new RegistroLealtadResponse();
   
  }

  ngOnInit() {
    this.createFormulario();
    this. createFormularioConsulta();
  }

  onCancelarCambioPrecio() {
    this._bsModalRef.hide();
  }

  registrarCliente() {
    this.bolNuevoCliente = true;
    this.showButtons = true;
  }

  regresar() {
    this.bolNuevoCliente = false;
    this.showButtons = false;
  }

  clienteSeleccionado(e) {
    
    const añoActual = this.fecha.getFullYear(); 
    let mesActual:string = (this.fecha.getMonth() + 1).toString(); 
    let diaActual:string = this.fecha.getDate().toString(); 

    if (mesActual.toString().length == 1) {
      mesActual =`0${mesActual}`;
    }

    if (diaActual.toString().length == 1) {
      diaActual =`0${diaActual}`;
    }

    const fechaLealtad =`${añoActual}${mesActual}${diaActual}`;

    this.seleccion = ({...e});

    this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.codigoClienteLealtad = e.iiCodigoCliente;
    this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.codigoClienteSistemaCredito = e.iiCodigoClienteSistemaCredito;
    this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.nivelLealtad = e.ssNivel;
    this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.primeraCompraLealtad = e.bbPrimeraCompra;
    this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.fechaLealtad = fechaLealtad;

    console.log(this.ticketVirtualInstance);

  }

  createFormulario() {
    this.frm = this.fb.group({
      sNombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      sPaterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      sMaterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      sGenero: ['F', Validators.required],
      sEmail: ['',[Validators.required, Validators.pattern(this.regex.CORREO)]],
      sTelefono: ['', [Validators.required, Validators.pattern(this.regex.TELEFONO)]],
      sFechaNacimiento: ['', Validators.required],
      iCodigoTiendaRegistra: [0, Validators.required],
      iCodigoCajaRegistra: [0, Validators.required],
      iCodigoEmpleadoRegistra: [0, Validators.required],
      iCodigoClienteSistemaCredito: [0, Validators.required], // Siempre 0
      iCodigoEmpleado: [0, Validators.required], // Siempre 0
      iCodigoClienteWeb: [0, Validators.required], // Siempre 0
      sFolioVenta: ['', Validators.required], // Si existe se envia, sino, vacio
    });
  }

  createFormularioConsulta() {
    this.frmConsulta = this.fb.group({
      iCodigoCliente: [], // Siempre 0
      iCodigoClienteSistemaCredito: [], // Siempre 0
      iCodigoEmpleado: [], // Siempre 0
      iCodigoClienteWeb: [], // Siempre 0
      sTelefono: ['', [Validators.pattern(this.regex.TELEFONO)]],
      sPaterno: [''],
      sMaterno: [''],
      sNombre: [''],
      sFechaNacimiento: [],
      iCodigoTiendaRegistro: [],
      sEmail: [''],
      iCodigoTienda: [],
      iCodigoCaja: [],
      bTiendaCaja: [],
    });
  }

  get f() { return this.frm.controls; }


  //#region Getter Nombre
  get getEstatusNombre() {
    return this.frm.get('sNombre').invalid && this.frm.get('sNombre').touched;
  }

  get getNombre() {
    return this.frm.controls['sNombre'];
  }
  //#endregion

  //#region Getter Apellido Paterno
  get getEstatusPaterno() {
    return this.frm.get('sPaterno').invalid && this.frm.get('sPaterno').touched;
  }
  get getPaterno() {
    return this.frm.get('sPaterno');
  }
  //#endregion

  //#region Getter Apellido Materno
  get getEstatusMaterno() {
    return this.frm.get('sMaterno').invalid && this.frm.get('sMaterno').touched;
  }
  get getMaterno() {
    return this.frm.get('sMaterno');
  }
  //#endregion

  //#region Getter Telefono
  get getEstatusTelefono() {
    return this.frm.get('sTelefono').invalid && this.frm.get('sTelefono').touched;
  }
  get getTelefono() {
    return this.frm.get('sTelefono');
  }
  //#endregion

  //#region Getter Correo
  get getEstatusCorreo() {
    return this.frm.get('sEmail').invalid && this.frm.get('sEmail').touched;
  }
  get getCorreo() {
    return this.frm.get('sEmail');
  }
  //#endregion

  //#region Getter Fecha de nacimiento
  get getEstatusFechaNacimiento() {
    return this.frm.get('sFechaNacimiento').invalid && this.frm.get('sFechaNacimiento').touched;
  }
  get getFechaNacimiento() {
    return this.frm.get('sFechaNacimiento');
  }
  //#endregion


  SaveForm() {

    this.registroLealtadRequest = ({ ...this.frm.value });

    this.loggedInfo = JSON.parse(localStorage.getItem('accessInfo'));
    //console.log(JSON.stringify(this.loggedInfo ));

    this.registroLealtadRequest.iCodigoCajaRegistra = this.loggedInfo.numeroCaja;
    this.registroLealtadRequest.iCodigoEmpleadoRegistra = 506856;//this.loggedInfo.numberEmployee;
    this.registroLealtadRequest.iCodigoTiendaRegistra = parseInt(this.loggedInfo.nombre.substring(7, 12));

    this._lealtadService.RegistroClienteLealtad(this.registroLealtadRequest).subscribe(
      resp => {
        this.registroLealtadResponse = ({ ...resp });
        this.numeroClienteGenerado = this.registroLealtadResponse.iCodigoCliente.toString();
        //alert(JSON.stringify(this.registroLealtadResponse));

        if (this.registroLealtadResponse.bError) {
          this._alertService.show({ tipo: 'error', titulo: 'POS Milano', mensaje: this.registroLealtadResponse.sMensaje });
          return;
        }

        this._alertService.show({ tipo: 'success', titulo: 'POS Milano', mensaje: this.registroLealtadResponse.sMensaje });

        this.limpiar('registro');
      }
    );
  }

  ConsultaForm() {

    this.seleccion = null;

    this.consultaLealtadRequest = new ConsultaLealtadRequest(this.frmConsulta.value );
    //this.consultaLealtadRequest = ({ ...this.frmConsulta.value });
    this.loggedInfo = JSON.parse(localStorage.getItem('accessInfo'));
   
    if ( this.consultaLealtadRequest.bTiendaCaja) {
      this.consultaLealtadRequest.iCodigoCaja = this.loggedInfo.numeroCaja;
      //this.consultaLealtadRequest.iCodigoEmpleado = 506856;//this.loggedInfo.numberEmployee;
      this.consultaLealtadRequest.iCodigoTienda = parseInt(this.loggedInfo.nombre.substring(7, 12));
    }else{
      this.consultaLealtadRequest.iCodigoCaja = 0;
      this.consultaLealtadRequest.iCodigoTienda = 0;
    }

    this._lealtadService.ConsultaClienteLealtad(this.consultaLealtadRequest).subscribe(
      resp => {

        //console.log(JSON.stringify(resp));
        this.consultaLealtadResponse = ({ ...resp });

        if (this.consultaLealtadResponse.sMensajeError && this.consultaLealtadResponse.sMensajeError != '' ) {
          this._alertService.show({ tipo: 'error', titulo: 'POS Milano', mensaje: this.consultaLealtadResponse.sMensajeError });
          return;
        }

        //console.log(JSON.stringify( this.consultaLealtadResponse.InfoClientesCRM));
      }
    );
  }

  limpiar(formulario: string){
    if (formulario == "busqueda") {
      this.frmConsulta.reset();
      this.consultaLealtadResponse.InfoClientesCRM = [];
    }else{
      this.frm.reset();
      this.frm.controls['sGenero'].setValue('F');
    }

  }
}

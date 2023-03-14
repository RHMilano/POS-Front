import {ResultadoValidacionCaja} from '../InicioFin/ResultadoValidacionCaja';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AlertService} from '../../services/alert.service';
import {InicioFinDiaService} from '../../services/inicio-fin-dia.service';
import {Input} from '@angular/core';

export interface FinDiaComponentInterface {
  capturaLuz: boolean;
  validacionCajas: Array<ResultadoValidacionCaja>;
  capturaLuzInicio: boolean;
  FinDiaInstance: FinDiaComponentInterface;
  validacionCajasEjec: boolean;
  validacion: boolean;
  cajas: any[];
  clave: string;
  modalRef: BsModalRef;
  _alertService: AlertService;
  modalService: BsModalService;
  _iniciofinService: InicioFinDiaService;

  ngOnInit(): void;

  fetch(cb): void;

  solicitarCaptura(): void;

  closeModal(): void;

  lecturaZ(codigoCaja): void;
}

import { PagosToDisplay } from '../../Models/Pagos/PagosToDisplay';

export class LineaPago {

  pagos: Array<PagosToDisplay> = [];
  nombre: string;
  cantidad: number;
  isAnulable: boolean;

  constructor(item: PagosToDisplay) {
    this.nombre = item.nombreCompuesto || item.nombre;
    this.cantidad = 0;
    this.pagos.push(item);
    this.isAnulable = item.anulable;
    this.updateCantidad();
  }

  addToLineaPago(item: PagosToDisplay) {
    this.pagos.push(item);
    this.updateCantidad();
  }

  updateCantidad() {
    //debugger;
    this.cantidad = 0;

    this.pagos.reduce((prev, curr) => {
      this.cantidad += curr.formaDePago.importeMonedaNacional;
      return curr;
    }, this.pagos[0]);

  }

  getIds(): Array<number> {
    return this.pagos.map(item => item.idPago);
  }

}

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DescuentoPromocionalVentaModel } from '../../Models/Pagos/DescuentoPromocionalVenta.model';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.css']
})
export class CarrouselComponent implements OnInit, OnChanges {

  @Input() promocionesAplicadas?: Array<DescuentoPromocionalVentaModel>;

  setPromoAplicadas: Array<DescuentoPromocionalVentaModel> = [];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['promocionesAplicadas']) {
      this.setPromoAplicadas = changes['promocionesAplicadas'].currentValue;
    }

  }


  ngOnInit() {
    this.setPromoAplicadas = this.promocionesAplicadas || [];
  }

}

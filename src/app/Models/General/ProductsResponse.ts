import { Articulo } from '../../layout/ticket-virtual/articulo/Articulo';
import { DescuentoPromocionalLineaModel } from '../Sales/DescuentoPromocionalLinea.model';
import { ProductsResponse } from './ProductsResponse.model';

export class ProductsResponseClass implements ProductsResponse {
  articulo: Articulo;

  constructor(params: ProductsResponse = {} as ProductsResponse) {
    const {
      articulo = new Articulo()
    } = params;
    this.articulo = articulo;
  }
}

import { ProductsRequestModel } from './General/ProductsRequest.model';

export class ProductsRequest implements ProductsRequestModel {
  sku: string;
  upc: string;


  constructor(params: ProductsRequestModel = {} as ProductsRequestModel) {
    const { // Valores por defecto
      sku = '',
      upc = ''
    } = params;

    this.sku = sku;
    this.upc = upc;
  }

}

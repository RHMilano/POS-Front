export interface ProductsRequestModel {
  sku?: string;
  upc?: string;
  codeStore?: number;
  extendedSearch?: boolean;
  style?: string;
  codeProvider?: number;
  codeDepartment?: number;
  codeSubDepartment?: number;
  codeClass?: number;
  codeSubClass?: number;
  description?: string;
  numeroPagina?: number;
  registrosPagina?: number;
}

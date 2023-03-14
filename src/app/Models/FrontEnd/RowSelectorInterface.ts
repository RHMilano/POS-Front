export interface RowSelectorInterface {
  currentSelection: number;

  selectRowUp(): any;

  selectRowDown(): any;

  selectFirstRow(): any;

  isLastRow?(): boolean;

  isFirstRow?(): boolean;

  jumpFocusToNextElement?(): any;

  jumpFocusToPrevElement?(): any;

  pageChange?(pageNumber: number): any;

  pageForward?(): any;

  pageBackward?(): any;

  setFocusOnElement?(): any;

  selectOnEnter?(): any;

}

export interface RowSelectorConfig {
  totalItemsToPaginate: number;
  itemsPerPage: number;
  rowSelector: RowSelectorInterface;

  setSelectedItem(selectedItem: any, index: any): any;
}

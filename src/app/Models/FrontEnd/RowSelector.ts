import { RowSelectorConfig, RowSelectorInterface } from './RowSelectorInterface';

export class RowSelector implements RowSelectorInterface {

  currentSelection: number;
  pageNumber: number;
  itemsPerPage: number;

  constructor(public owner = {} as RowSelectorConfig) {
    this.currentSelection = 0;
    this.pageNumber = 1;
    this.itemsPerPage = owner.itemsPerPage;
  }

  isFirstRow(): boolean {
    return this.currentSelection === 0;
  }

  isLastRow(): boolean {
    const totalItems = this.owner.totalItemsToPaginate;
    const lastItems = this.pageNumber * this.itemsPerPage;

    if (totalItems > lastItems && this.currentSelection === this.itemsPerPage - 1) {
      return true;
    } else if (totalItems < lastItems && this.currentSelection === (this.itemsPerPage - (lastItems - totalItems)) - 1) {
      return true;
    } else if (totalItems === lastItems && this.currentSelection === this.itemsPerPage) {
      return true;
    } else {
      return false;
    }

  }

  selectFirstRow(): any {
    this.currentSelection = 0;
    this.setSelectionFromKeyboard();
  }

  selectRowDown(): any {
    const totalItems = this.owner.totalItemsToPaginate;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);

    if (this.isLastRow()) {

      if (this.pageNumber === totalPages) {
        this.pageNumber = 1;
      } else {
        this.pageNumber++;
      }

      this.currentSelection = 0;
    } else {
      this.currentSelection++;
    }
    this.setSelectionFromKeyboard();
  }

  selectRowUp(): any {
    const totalItems = this.owner.totalItemsToPaginate;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);

    if (this.isFirstRow()) {

      if (this.pageNumber === 1) {
        this.pageNumber = totalPages;

        const lastItems = this.pageNumber * this.itemsPerPage;

        if (totalItems > lastItems) {
          this.currentSelection = this.itemsPerPage - 1;
        } else if (totalItems < lastItems) {
          this.currentSelection = (this.itemsPerPage - (lastItems - totalItems)) - 1;
        }

      } else {
        this.pageNumber--;
        this.currentSelection = this.itemsPerPage - 1;
      }


    } else {
      this.currentSelection--;
    }
    this.setSelectionFromKeyboard();
  }

  setSelectionFromKeyboard() {
    this.owner.setSelectedItem(null, ((this.pageNumber - 1) * this.itemsPerPage) + this.currentSelection);
  }

  selectOnEnter() {
    this.setSelectionFromKeyboard();


    if (this.owner['onRowEnterAction']) {
      this.owner['onRowEnterAction']();
    }

  }

  pageChange(pageNumber: number): any {
    this.currentSelection = 0;
    this.pageNumber = pageNumber;
    this.setSelectionFromKeyboard();
  }

  pageBackward(): any {
    const totalItems = this.owner.totalItemsToPaginate;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);

    if (this.pageNumber === 1) {
      this.pageChange(totalPages);
    } else {
      this.pageChange(this.pageNumber - 1);
    }

  }

  pageForward(): any {
    const totalItems = this.owner.totalItemsToPaginate;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);

    if (this.pageNumber === totalPages) {
      this.pageChange(1);
    } else {
      this.pageChange(this.pageNumber + 1);
    }
  }

}

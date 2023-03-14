import { ConfiguracionBoton } from '../../Models/General/ConfiguracionBoton';

export class MenuButtonPaginator {

  itemsPerPageFirst = 5;
  itemsPerPageSecondLevel = 4;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  inEnd: boolean;
  levelConfigs: {
    [number: number]: {
      buttons?: Array<ConfiguracionBoton>,
      page?: number,
      title?: string,
      totalPages?: number
    }
  } = {};


  constructor(public buttons: Array<ConfiguracionBoton> = [], public level: number) {
    this.itemsPerPage = !level ? this.itemsPerPageFirst : this.itemsPerPageSecondLevel;
    this.totalPages = Math.ceil(this.buttons.length / this.itemsPerPage);

    this.levelConfigs[level] = {};
    this.levelConfigs[level].buttons = buttons;
    this.levelConfigs[level].title = '';
    this.levelConfigs[level].totalPages = this.totalPages;

  }

  setConfig(conf: ConfiguracionBoton) {
    this.level++;
    this.itemsPerPage = !this.level ? this.itemsPerPageFirst : this.itemsPerPageSecondLevel;
    this.buttons = conf.configuracionSubBotones;
    this.totalPages = Math.ceil(this.buttons.length / this.itemsPerPage);

    this.levelConfigs[this.level] = {};
    this.levelConfigs[this.level].buttons = conf.configuracionSubBotones;
    this.levelConfigs[this.level].title = conf.textoDescripcion;
    this.levelConfigs[this.level].totalPages = this.totalPages;
  }

  getPage(pageNumber: number): Array<ConfiguracionBoton> {

    this.currentPage = pageNumber;
    const itemsToShow: Array<ConfiguracionBoton> = [];
    const end = ((pageNumber * this.itemsPerPage) - 1) >= this.buttons.length ?
      this.buttons.length - 1 : ((pageNumber * this.itemsPerPage) - 1);
    const beg = (pageNumber - 1) * this.itemsPerPage;


    this.buttons.map(btn => btn.mostrandoHijos = false);


    if (!!this.level) {
      itemsToShow.push({
        textoDescripcion: this.buttons[0].btnParent.textoDescripcion,
        teclaAccesoRapido: 'Regresar → Esc',
        rutaImagen: this.buttons[0].btnParent.rutaImagen,
        habilitado: true,
        visible: true,
        handler: 'chilsControl',
        clase: 'btn_funcion_control',
        tooltip: '',
        identificador: '',
        orden: 0,
        configuracionSubBotones: []
      });
    }


    for (let i = beg; i <= end; i++) {
      if (this.buttons[i].visible) {
        itemsToShow.push(this.buttons[i]);
      }
    }
    if (pageNumber === this.totalPages) {
      this.inEnd = true;
    }

    if (pageNumber === 1) {
      this.inEnd = false;
    }

    if (this.totalPages > 1) {

      const fd = this.inEnd ? 'left' : 'right';
      const ad = this.inEnd ? '←' : '→';
      itemsToShow.push({
        orden: 0,
        textoDescripcion: 'Más Funciones',
        teclaAccesoRapido: ad,
        rutaImagen: 'fa fa-angle-double-' + fd + ' bt-flecha',
        habilitado: true,
        visible: true,
        handler: 'pageControl',
        clase: 'btn_funcion_control',
        configuracionSubBotones: [],
        identificador: 'controlMas',
        tooltip: ''
      });
    }


    this.levelConfigs[this.level].page = this.currentPage;
    return itemsToShow;

  }

  pageControl(): Array<ConfiguracionBoton> {
    if (this.inEnd) {
      this.currentPage = this.currentPage - 1;
    } else {
      this.currentPage = this.currentPage + 1;
    }
    this.levelConfigs[this.level].page = this.currentPage;
    return this.getPage(this.currentPage);
  }

  pageBackwards() {
    if (this.currentPage === 1) {
      this.currentPage = this.totalPages;
    } else {
      this.currentPage--;
    }
    this.levelConfigs[this.level].page = this.currentPage;
    return this.getPage(this.currentPage);
  }

  pageFordward() {
    if (this.currentPage === this.totalPages) {
      this.currentPage = 1;
    } else {
      this.currentPage++;
    }
    this.levelConfigs[this.level].page = this.currentPage;
    return this.getPage(this.currentPage);
  }

  chilsControl() {
    if (!!this.level) {
      this.level--;
      this.buttons = this.levelConfigs[this.level].buttons;
      this.totalPages = this.levelConfigs[this.level].totalPages;
      this.itemsPerPage = !this.level ? this.itemsPerPageFirst : this.itemsPerPageSecondLevel;
    }
    return this.getPage(this.levelConfigs[this.level].page);
  }

  getLevel(level: number) {
    this.level = level;
    this.buttons = this.levelConfigs[this.level].buttons;
    this.totalPages = this.levelConfigs[this.level].totalPages;
    this.itemsPerPage = !this.level ? this.itemsPerPageFirst : this.itemsPerPageSecondLevel;
    return this.getPage(this.levelConfigs[this.level].page || 1);
  }

  getTitle() {
    return this.levelConfigs[this.level].title || '';
  }

  getAllCurrentLevel(): Array<ConfiguracionBoton> {
    return this.levelConfigs[this.level].buttons;
  }

  getPageOfButton(btn: ConfiguracionBoton): Array<ConfiguracionBoton> {
    const btnFoundIndex = this.buttons.findIndex(innerBtn => innerBtn.identificador === btn.identificador);
    const pageNumber = Math.ceil((btnFoundIndex + 1) / this.itemsPerPage);
    return this.getPage(pageNumber);
  }

}

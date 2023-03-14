export interface IAlerta {
  tipo: 'error'|'info'|'success'|'warning';
  mensaje: string;
  titulo: string;
}

export interface Msg {
  tipo?: 'error'|'info';
  message?: string;
  config?: { class: string };
}

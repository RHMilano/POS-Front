export interface UserRequest {
  numberEmployee: number;
  password: string;
  numberAttempts: number;
  tokenDevice: string;
  esLoginInicial: number;
}

export interface UserResponse {
  numberEmployee: number;
  estatus: string;
  codeEstatus: number;
  numberAttempts: number;
  accesstoken: string;
  numeroCaja: number;
  nombre: string;
  numeroTienda:string;
  //AHC:
  vencioPassword: number;
}

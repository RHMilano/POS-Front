import { UserRequest } from './Security/User.model';
import { environment } from '../../environments/environment';

export class LoginRequest implements UserRequest {
  numberEmployee: number;
  password: string;
  numberAttempts: number;
  tokenDevice: string;
  esLoginInicial: number;

  constructor(params: UserRequest = {} as UserRequest) {

    const {numberEmployee = 0, 
      password = '', 
      numberAttempts = 1,
      tokenDevice = '',
      esLoginInicial = 0} = params;

    if (environment.autoLogin) {
      this.password = 'milano123';
      this.numberEmployee = 1717;
      this.tokenDevice = '';
      this.esLoginInicial = 0;
    } else {
      this.password = password;
      this.numberEmployee = numberEmployee;
      this.numberAttempts = numberAttempts;
      this.tokenDevice = tokenDevice;
      this.esLoginInicial = esLoginInicial;
    }
  }
}

export class changePasswordRequest {
  numberEmployee: number;
  password: string;
  numberAttempts: 1;
}

export class changePasswordResponse {
  codeDescription : string;
  codeNumber : number;
  status: boolean;
}

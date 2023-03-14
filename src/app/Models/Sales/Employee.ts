export class EmployeeRequest {
  code: number;
  name: string;
}

export class EmployeeResponse {
  code: number;
  userName: string;
  name: string;
  paternal: string;
  maternal: string;
  roleCode: string;
  sex: string;
  initialDate: string;
  position: string;
  status: string;
  store: number;

}

export class Employee implements EmployeeResponse {
  code: number;
  initialDate: string;
  maternal: string;
  name: string;
  paternal: string;
  position: string;
  roleCode: string;
  sex: string;
  status: string;
  store: number;
  userName: string;

  constructor(params: EmployeeResponse = {} as EmployeeResponse) {
    const {
      code = 0,
      initialDate = '',
      maternal = '',
      name = '',
      paternal = '',
      position = '',
      roleCode = '',
      sex = '',
      status = '',
      store = 0,
      userName = ''
    } = params;

    this.code = code;
    this.initialDate = initialDate;
    this.maternal = maternal;
    this.name = name;
    this.paternal = paternal;
    this.position = position;
    this.roleCode = roleCode;
    this.sex = sex;
    this.status = status;
    this.store = store;
    this.userName = userName;

  }

}

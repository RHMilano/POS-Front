export interface AuthAndExecSUDO {
  path: string;
  params: any;
}

export interface SuperUserCallback {
  component: any;
  callBack: string;
  authAndExec?: AuthAndExecSUDO;
  passthroughAdmin: boolean;
  ModalLevel: number;
  getInitialState?: () => Object;
  callBackFn?;
  callbackParams?: Array<any>;
  cancelCallback?: string;
  cancelCallbackParams?: Array<any>;
  backdrop?: string;
  keyboard?: boolean;
  staticMode?: boolean;
  modalService?;
}

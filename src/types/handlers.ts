import { PropertyPath } from "lodash";
import { IStorageOption, IMapItem } from "../types/action";
import IAppConfig, { IProxyConfig } from "./IAppConfig";

export type IHandler = (
  path: string,
  appConfig: IAppConfig,
  proxyConfig: IProxyConfig,
  handlerOption: IHandlerOption
) => any;

export interface IAction {
  type: string;
  context?: string[];
  options?: any;
}

export interface IHandlerOption {
  type: string;
  actions?: IAction[];
}

export interface IResponseBodyHandlerOption {
  type: "reponseBody";
  options: {
    success: {
      key: PropertyPath;
      value: string | number;
      storage?: IStorageOption[];
    };
    error?: {
      key: PropertyPath;
      value: string | number;
      data?: IMapItem;
    };
  };
}

export interface ISessionHanlderOption {
  type: "session";
  options: {
    type: "clear" | "set" | "delete";
    success: {
      key: PropertyPath;
      value: string | number;
      data?: IMapItem;
    };
    data?: IMapItem;
  };
}

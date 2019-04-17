import { PropertyPath } from "lodash";
import { IMapItem } from "../types/action";
import IAppConfig, { IProxyConfig } from "./IAppConfig";

export type IHandler = (
  path: string,
  appConfig: IAppConfig,
  proxyConfig: IProxyConfig,
  handlerOption: IHandlerOption
) => any;

export interface IHandlerOption {
  type: string;
  options: any;
}

export interface IResponseBodyHandlerOption {
  type: "reponseBody";
  options: {
    success: {
      key: PropertyPath;
      value: string | number;
      data?: IMapItem;
    };
    error?: {
      key: PropertyPath;
      value: string | number;
      data?: IMapItem;
    };
  };
}

export interface IRequestBodyHandlerOption {
  type: "requestBody";
  options?: {
    extraBody: any;
    bodyMapping: any;
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

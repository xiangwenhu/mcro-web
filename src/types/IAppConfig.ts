import httpProxy from "http-proxy-middleware";
import { IDynamicObject } from "../types/action";
import { IHandlerOption } from "./handlers";
import IOSSOption from "./IOSSOption";

export type sessionType = "session" | "jwt";

export type IProxyConfig = {
  dynamicBody?: IDynamicObject;
  afterHandlers?: IHandlerOption[];
  beforeHandlers?: IHandlerOption[];
  useFormData?: boolean;
  auth?: boolean;
} & httpProxy.Config;

export default interface IAppConfig {
  appId: string;
  appToken?: string;
  domain: string;
  title: string;
  template: string;
  proxy?: {
    [key: string]: IProxyConfig;
  };
  configData?: IAppGeneralConfig;
}

export interface IAppGeneralConfig {
  oss?: IOSSOption;
  services?: {
    [path: string]: {
      auth: boolean;
      data: any;
    }
  };
}

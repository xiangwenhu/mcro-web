import httpProxy from "http-proxy-middleware";
import { IDynamicObject } from "../types/action";
import { IHandlerOption } from "./handlers";

export type sessionType = "session" | "jwt";

export type IProxyConfig = {
  dynamicBody?: IDynamicObject;
  afterHandlers?: IHandlerOption[];
  beforeHandlers?: IHandlerOption[];
  useFormData?: boolean;
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
  configData?: any;
}

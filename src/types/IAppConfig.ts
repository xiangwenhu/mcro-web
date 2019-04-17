import httpProxy from "http-proxy-middleware";
import { IDynamicObject } from "../types/action";
import { IResponseHandler, ISessionHanlder } from "./handlers";

export type sessionType = "session" | "jwt";

export type IProxyConfig = {
  extraBody?: any;
  dynamicHeader?: IDynamicObject;
  bodyMapping?: any;
  dynamicBody?: IDynamicObject;
  afterHandlers?: Array<IResponseHandler | ISessionHanlder>;
} & httpProxy.Config;

export default interface IAppConfig {
  appId: string;
  appToken?: string;
  domain: string;
  title: string;
  template: string;
  proxy: {
    [key: string]: IProxyConfig;
  };
}

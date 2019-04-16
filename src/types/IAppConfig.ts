import httpProxy from "http-proxy-middleware";
import { PropertyPath } from "lodash";
import { IDynamicObject, IMapItem } from "../types/action";

interface IHandleResponse {
  success: {
    key: PropertyPath;
    value: string | number;
    data?: IMapItem;
  };
  error?: {
    key: PropertyPath,
    value: string | number,
    data?: IMapItem;
  };
}

export type sessionType = "session" | "jwt";

export type IProxyConfig = {
  extraBody?: any;
  dynamicHeader?: IDynamicObject;
  bodyMapping?: any;
  dynamicBody?: IDynamicObject;
  afterResponse?: [
    {
      type: string;
      handler: IHandleResponse;
    }
  ];
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

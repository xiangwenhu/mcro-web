import httpProxy from "http-proxy-middleware";
import IKeyValue from "./common";

interface IDataItem {
  path?: string;
  name: string;
  default?: any;
}

export type sessionType = "session" | "jwt";

export type IProxyConfig = {
  extraData?: any;
  mapping?: any;
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
  auth: {
    acl?: boolean;
    type?: sessionType;
    login: {
      url: string;
      success: IKeyValue<string, string | number> & { data: IDataItem[] };
    };
    logout: {
      url: string;
      success: IKeyValue<string, string | number>;
    };
  };
}

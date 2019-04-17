import express from "express";
import * as http from "http";
import { getProxyConfigByAppId, getConfigById } from "../../demoConfig";
import { IProxyConfig } from "../../types/IAppConfig";
import { excuteBeforeHandlers } from "./excuteHandlers";

export default function createProxyReq(path: string) {
  return function onProxyReq(
    proxyReq: http.ClientRequest,
    req: express.Request,
    res: express.Response
  ) {
    const appId = req.cookies.appId;
    const appConfig = getConfigById(appId);
    const proxyConfig: IProxyConfig = getProxyConfigByAppId(appId, path);

    if (!proxyConfig) {
      return;
    }
    // 自处理
    if (proxyConfig.beforeHandlers && proxyConfig.beforeHandlers.length > 0) {
      excuteBeforeHandlers(proxyReq, req, res)(
        path,
        appConfig,
        proxyConfig,
        proxyConfig.beforeHandlers
      );
    }
  };
}

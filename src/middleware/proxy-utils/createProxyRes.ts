import express from "express";
import * as http from "http";
import { getProxyConfigByAppId, getConfigById } from "../../demoConfig";
import { IProxyConfig } from "../../types/IAppConfig";
import { excuteAfterHandlers } from "./excuteHandlers";

export default function createProxyRes(path: string) {
  return function onProxyRes(
    proxyRes: http.IncomingMessage,
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
    if (proxyConfig.afterHandlers && proxyConfig.afterHandlers.length > 0) {
      excuteAfterHandlers(proxyRes, req, res)(
        path,
        appConfig,
        proxyConfig,
        proxyConfig.afterHandlers
      );
    }
  };
}

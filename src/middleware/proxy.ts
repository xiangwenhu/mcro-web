import express from "express";
import httpProxy from "http-proxy-middleware";
import _ from "lodash";

import { AppConfigs, getProxyConfigByAppId } from "../demoConfig";
import IAppConfig from "../types/IAppConfig";

import createProxyReq from "./proxy-utils/createProxyReq";
import createProxyRes from "./proxy-utils/createProxyRes";

function createProxy(path: string) {
  return function executeProxy(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // 检查当前appId下，是否有相关配置
    const appId = req.cookies.appId;
    if (!appId) {
      next();
      return;
    }
    const proxyConfig = getProxyConfigByAppId(appId, path);
    if (_.isEmpty(proxyConfig)) {
      next();
      return;
    }
    // 代理请求
    proxyConfig.onProxyReq = createProxyReq(path);
    proxyConfig.onProxyRes = createProxyRes(path);
    httpProxy(proxyConfig)(req, res, next);
  };
}

function preMiddlewares() {
  return [];
}

export default (app: express.Express) => {
  const configs = AppConfigs;
  configs.forEach((config: IAppConfig) => {
    Object.keys(config.proxy).forEach((path) => {
      app.use(path, ...preMiddlewares(), createProxy(path));
    });
  });
};

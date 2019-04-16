import express from "express";
import httpProxy from "http-proxy-middleware";
import * as http from "http";
import _ from "lodash";
import { AppConfigs } from "../demoConfig";
import IAppConfig, { IProxyConfig } from "../types/IAppConfig";
import { updateWith, reMapping, set, get } from "../utils/common";
import { IMapItem } from "src/types/common";
import { dynamicHeader } from "../actions/dynamicHeader";
import * as querystring from "querystring";

function createProxyReq(path: string) {
  return function onProxyReq(
    proxyReq: http.ClientRequest,
    req: express.Request,
    res: express.Response
  ) {
    const appId = req.cookies.appId;
    const proxyConfig: IProxyConfig = getProxyConfigByAppId(appId, path);

    if (!proxyConfig) {
      return;
    }

    // 额外的header, 需要读取session或者cookie
    if (proxyConfig.dynamicHeader) {
      dynamicHeader(proxyReq, req, res)(proxyConfig.dynamicHeader);
    }

    // https://github.com/nodejitsu/node-http-proxy/issues/1279
    const contentType = proxyReq.getHeader("content-type") as string;
    if (
      contentType &&
      (contentType.includes("application/json") ||
        contentType.includes("application/x-www-form-urlencoded"))
    ) {
      if (!req.body || !Object.keys(req.body).length) {
        return;
      }
      let body = req.body;
      // 额外的body
      body = updateWith(body, proxyConfig.extraBody);
      // TODO:: 额外的body, 需要读取session或者cookie

      // 字段重新映射
      body = reMapping(body, proxyConfig.bodyMapping);

      const bodyStr = contentType.includes("application/json")
        ? JSON.stringify(body)
        : querystring.stringify(body);
      proxyReq.setHeader("content-length", Buffer.byteLength(bodyStr));
      proxyReq.write(bodyStr);
      proxyReq.end();
    }
  };
}

function readRes(proxyRes: any, callback: (data: any) => any) {
  let body: any = Buffer.from("");
  proxyRes.on("data", function(data) {
    body = Buffer.concat([body, data]);
  });
  proxyRes.on("end", function() {
    callback(body);
  });
}

function createProxyRes(path: string) {
  return function onProxyRes(
    proxyRes: any,
    req: express.Request,
    res: express.Response
  ) {
    const appId = req.cookies.appId;
    const proxyConfig: IProxyConfig = getProxyConfigByAppId(appId, path);

    if (!proxyConfig) {
      return;
    }

    // 自处理
    if (proxyConfig.selfHandleResponse === true) {
      try {
        readRes(proxyRes, (data: any) => {
          
        });
      } catch (err) {
        res.json({
          code: 99999,
          message: err.message
        });
      }
    }
  };
}

function getProxyConfigByAppId(appId, path) {
  const appConfig = AppConfigs.find((config: IAppConfig) => {
    return config.appId === appId;
  });
  const key = Object.keys(appConfig.proxy).find((k) => k === path);
  return appConfig.proxy[key];
}

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

export default (app: express.Express) => {
  const configs = AppConfigs;
  configs.forEach((config: IAppConfig) => {
    Object.keys(config.proxy).forEach((path) => {
      app.use(path, createProxy(path));
    });
  });
};

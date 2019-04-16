import express from "express";
import httpProxy from "http-proxy-middleware";
import formurlencoded from "form-urlencoded";
import _ from "lodash";
import { getConfigById } from "../demoConfig/index";
import { AppConfigs } from "../demoConfig";
import IAppConfig, { IProxyConfig } from "../types/IAppConfig";
import { updateWith, reMapping } from "../utils/common";

function createProxyReq(path: string) {
  return function onProxyReq(proxyReq: any, req: express.Request, res: any) {
    // POST 请求
    
    if (req.method === "POST") {
      let { body = {} } = req;

      const appId = req.cookies.appId;
      const proxyConfig: IProxyConfig = getProxyConfigByAppId(appId, path);

      // 合并额外的字段
      body = updateWith(body, proxyConfig.extraData);
      // 字段重新映射
      body = reMapping(body, proxyConfig.mapping);

      const bodyStr = formurlencoded(body);
      if (req.session && req.session.token) {
        proxyReq.setHeader("authorization", req.session.token);
      }
      proxyReq.setHeader("content-type", "application/x-www-form-urlencoded");
      proxyReq.setHeader("content-length", bodyStr.length);
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

function onProxyRes(
  proxyRes: any,
  req: express.Request,
  res: express.Response
) {
  // 如果登录地址相同，解析res的结果
  const appId = req.cookies.appId;
  const config = getConfigById(appId);
  const { login: loginConfig, logout: logoutConfig } = config.auth;
  if ([loginConfig.url, logoutConfig.url].includes(req.originalUrl)) {
    readRes(proxyRes, (data: any) => {
      const body = JSON.parse(data.toString());
      if (!_.isEmpty(loginConfig) && loginConfig.url === req.originalUrl) {
        if (body[loginConfig.success.key] === loginConfig.success.value) {
          loginConfig.success.data.forEach((d) => {
            if (d.path) {
              req.session[d.name] = _.get(body, d.path);
            } else if (d.name && d.default) {
              req.session[d.name] = d.default;
            }
          });
        }
        if (config.auth.acl === true) {
          body.data = [];
        }
        res.json(body);
        return;
      } else if (
        !_.isEmpty(logoutConfig) &&
        logoutConfig.url === req.originalUrl
      ) {
        req.session.destroy(null);
        res.json({
          code: 0,
          errCode: 0
        });
        return;
      }
    });
  }
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
    proxyConfig.onProxyRes = onProxyRes;
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

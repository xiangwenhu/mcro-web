import express from "express";
import * as http from "http";
import { IProxyConfig } from "../../types/IAppConfig";
import readResponse from "./readResponse";
import { getProxyConfigByAppId } from "../../demoConfig";
import { IResponseHandler } from "../../types/handlers";
import { get, set } from "../../utils/common";
import { IMapItem } from "src/types/action";

function getHanldersContext(
  proxyRes: http.IncomingMessage,
  req: express.Request,
  res: express.Response
) {
  const context = { proxyRes, req, res };
  return function excuteHandlers(
    path: string,
    proxyConfig: IProxyConfig,
    handlers: Array<IResponseHandler | any> = []
  ) {
    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      if (handler.type) {
        continue;
      }
      switch (handler.type) {
        case "response":
          responseHandler.bind(context)(path, proxyConfig, handler);
          break;
        default:
          break;
      }
    }
  };
}

function responseHandler(
  path: string,
  proxyConfig: IProxyConfig,
  handler: IResponseHandler
) {
  const {
    proxyRes,
    req,
    res
  }: {
    proxyRes: http.IncomingMessage;
    req: express.Request;
    res: express.Response;
  } = this;
  if (!proxyConfig) {
    return;
  }
  // 自处理
  if (handler && proxyConfig.selfHandleResponse === true) {
    try {
      readResponse(proxyRes, (data: any) => {
        const { success, error } = handler.options;
        const body = JSON.parse(data);

        const okValue = get(body, success.key);
        if (okValue === success.value) {
          for (const [key, d] of Object.entries(success.data as IMapItem)) {
            if (d.type === "session") {
              set(req.session, key, get(body, d.path) || d.defaultValue);
            } else if (d.type === "cookie") {
              res.cookie(key, get(body, d.path) || d.defaultValue);
            }
          }
          return res.json(body);
        } else {
          const ret = { code: 99999, message: `${path}返回解析失败！` };
          if (error) {
            set(ret, error.key, error.value);
            if (error.data) {
              for (const [key, value] of Object.entries(
                error.data as IMapItem
              )) {
                set(ret, key, value.defaultValue);
              }
            }
          }
          return res.json(ret);
        }
      });
    } catch (err) {
      res.json({
        code: 99999,
        message: err.message
      });
    }
  }
}

export default function createProxyRes(path: string) {
  return function onProxyRes(
    proxyRes: http.IncomingMessage,
    req: express.Request,
    res: express.Response
  ) {
    const appId = req.cookies.appId;
    const proxyConfig: IProxyConfig = getProxyConfigByAppId(appId, path);

    if (!proxyConfig) {
      return;
    }
    // 自处理
    if (proxyConfig.afterHandlers && proxyConfig.afterHandlers.length > 0) {
      getHanldersContext(proxyRes, req, res)(
        path,
        proxyConfig,
        proxyConfig.afterHandlers
      );
    }
  };
}

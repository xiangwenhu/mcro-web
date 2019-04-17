import express from "express";
import * as http from "http";
import { getHandlerByType } from "../../handlers";
import { IHandlerOption } from "../../types/handlers";
import IAppConfig, { IProxyConfig } from "../../types/IAppConfig";
import _ from "lodash";

export function excuteAfterHandlers(
  proxyRes: http.IncomingMessage,
  req: express.Request,
  res: express.Response
) {
  const context = { proxyRes, req, res };
  return excuteHandlers(context);
}

export function excuteBeforeHandlers(
  proxyReq: http.ClientRequest,
  req: express.Request,
  res: express.Response
) {
  const context = { proxyReq, req, res };
  return excuteHandlers(context);
}

function excuteHandlers(
  context:
    | {
        proxyReq: http.ClientRequest;
        req: express.Request;
        res: express.Response;
      }
    | {
        proxyRes: http.IncomingMessage;
        req: express.Request;
        res: express.Response;
      }
) {
  return function(
    path: string,
    appConfig: IAppConfig,
    proxyConfig: IProxyConfig,
    handlers: IHandlerOption[] = []
  ) {
    for (const handler of handlers) {
      if (!handler.type) {
        continue;
      }
      const handlerFn = getHandlerByType(handler.type);
      if (_.isFunction(handlerFn)) {
        handlerFn.bind(context)(path, appConfig, proxyConfig, handler);
      }
    }
  };
}

import express from "express";
import * as http from "http";
import * as querystring from "querystring";
import _ from "lodash";
import { IHandlerOption } from "../types/handlers";
import IAppConfig, { IProxyConfig } from "../types/IAppConfig";
import { batchActions } from "../action";

export default function requestBodyHandler(
  path: string,
  appConfig: IAppConfig,
  proxyConfig: IProxyConfig,
  handlerOption: IHandlerOption
) {
  const {
    proxyReq,
    req
  }: {
    proxyReq: http.ClientRequest;
    req: express.Request;
  } = this;
  if (!proxyConfig) {
    return;
  }

  if (_.isEmpty(handlerOption)) {
    return;
  }

  // https://github.com/nodejitsu/node-http-proxy/issues/1279
  const contentType = proxyReq.getHeader("content-type") as string;
  if (
    contentType &&
    (contentType.includes("application/json") ||
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    )
  ) {
    if (!req.body || !Object.keys(req.body).length) {
      return;
    }
    const body = req.body;

    batchActions({
      proxyReq,
      req,
      path,
      appConfig,
      proxyConfig
    }, handlerOption);
    // TODO:: 额外的body, 需要读取session|cookie|config
    const bodyStr = contentType.includes("application/json")
      ? JSON.stringify(body)
      : querystring.stringify(body);
    proxyReq.setHeader("content-length", Buffer.byteLength(bodyStr));
    proxyReq.write(bodyStr);
    proxyReq.end();
  }
}

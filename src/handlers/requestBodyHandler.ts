import express from "express";
import * as http from "http";
import * as querystring from "querystring";
import _ from "lodash";
import { IRequestBodyHandlerOption } from "src/types/handlers";
import IAppConfig, { IProxyConfig } from "src/types/IAppConfig";
import { updateWith, reMapping } from "../utils/common";

export default function requestBodyHandler(
  path: string,
  appConfig: IAppConfig,
  proxyConfig: IProxyConfig,
  handlerOption: IRequestBodyHandlerOption
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
      contentType.includes("application/x-www-form-urlencoded"))
  ) {
    if (!req.body || !Object.keys(req.body).length) {
      return;
    }
    let body = req.body;
    // 额外的body
    if (!_.isEmpty(handlerOption.options) && !_.isEmpty(handlerOption.options.extraBody)) {
      body = updateWith(body, handlerOption.options.extraBody);
    }
    // TODO:: 额外的body, 需要读取session|cookie|config
    // 字段重新映射
    if (!_.isEmpty(handlerOption.options)  && handlerOption.options.bodyMapping) {
      body = reMapping(body, handlerOption.options.bodyMapping);
    }

    const bodyStr = contentType.includes("application/json")
      ? JSON.stringify(body)
      : querystring.stringify(body);
    proxyReq.setHeader("content-length", Buffer.byteLength(bodyStr));
    proxyReq.write(bodyStr);
    proxyReq.end();
  }
}

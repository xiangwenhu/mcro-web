import express from "express";
import * as http from "http";
import _ from "lodash";
import { IHandlerOption } from "src/types/handlers";
import IAppConfig, { IProxyConfig } from "src/types/IAppConfig";
import { sourceType, IDynamicObject } from "../types/action";
import { get } from "../utils/common";

export default function requestHeaderHandler(
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
  for (const [key, item] of Object.entries(
    handlerOption.options as IDynamicObject
  )) {
    let val;
    if (item.type === sourceType.cookie) {
      val = get(req.cookies, item.path);
    } else if (item.type === sourceType.session) {
      val = get(req.session, item.path);
    }
    if (!_.isEmpty(val)) {
      // TODO:: val可能不是字符串
      proxyReq.setHeader(key, val);
    }
  }
}

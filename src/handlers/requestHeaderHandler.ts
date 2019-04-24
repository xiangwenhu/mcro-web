import express from "express";
import * as http from "http";
import _ from "lodash";
import { IHandlerOption } from "../types/handlers";
import IAppConfig, { IProxyConfig } from "../types/IAppConfig";
import { batchActions } from "../action";

export default function requestHeaderHandler(
  path: string,
  appConfig: IAppConfig,
  proxyConfig: IProxyConfig,
  handlerOption: IHandlerOption
) {
  const {
    proxyReq,
    req,
    res
  }: {
    proxyReq: http.ClientRequest;
    req: express.Request;
    res: express.Response
  } = this;
  if (!proxyConfig) {
    return;
  }

  if (_.isEmpty(handlerOption) || _.isEmpty(handlerOption.actions)) {
    return;
  }

  batchActions({
    proxyReq,
    req,
    res,
    path,
    appConfig,
    proxyConfig
  }, handlerOption);

}

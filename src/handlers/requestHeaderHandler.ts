import express from "express";
import * as http from "http";
import _ from "lodash";
import { IHandlerOption } from "src/types/handlers";
import IAppConfig, { IProxyConfig } from "src/types/IAppConfig";
import headerAction from "../action/header";

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
  headerAction(
    proxyReq,
    req
  )(handlerOption.options);
}

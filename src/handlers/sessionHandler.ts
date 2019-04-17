import express from "express";
import { ISessionHanlderOption } from "../types/handlers";
import IAppConfig, { IProxyConfig } from "../types/IAppConfig";
import { emptyFunction } from "../utils/common";

export default function sessionHandler(
  path: string,
  appConfig: IAppConfig,
  proxyConfig: IProxyConfig,
  handlerOption: ISessionHanlderOption
) {
  const {
    req
  }: {
    req: express.Request;
  } = this;
  if (!proxyConfig) {
    return;
  }
  if (handlerOption.options.type === "clear") {
    req.session.destroy(emptyFunction);
  }
}

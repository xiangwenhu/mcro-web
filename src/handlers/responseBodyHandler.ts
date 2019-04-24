import express from "express";
import * as http from "http";
import { batchActions } from "../action";
import { IResponseBodyHandlerOption } from "../types/handlers";
import IAppConfig, { IProxyConfig } from "../types/IAppConfig";
import readResponse from "./utils/readResponse";

export default function responseBodyHandler(
  path: string,
  appConfig: IAppConfig,
  proxyConfig: IProxyConfig,
  handlerOption: IResponseBodyHandlerOption
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
  if (handlerOption && proxyConfig.selfHandleResponse === true) {
    try {
      readResponse(proxyRes, (data: any) => {
        const body = JSON.parse(data);

        batchActions({
          res,
          body,
          req,
          path,
          appConfig,
          proxyConfig
        }, handlerOption);

        return res.json(body);
      });
    } catch (err) {
      res.json({
        code: 99999,
        message: err.message
      });
    }
  }
}

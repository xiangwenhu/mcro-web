import express from "express";
import * as http from "http";
import IAppConfig, { IProxyConfig } from "../types/IAppConfig";
import readResponse from "./utils/readResponse";
import { IResponseBodyHandlerOption } from "../types/handlers";
import { get, set } from "../utils/common";
import { IMapItem, IStorageOption } from "src/types/action";
import sessionAction from "../action/session";
import _ from "lodash";

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
        const { success, error } = handlerOption.options;
        const body = JSON.parse(data);

        const okValue = get(body, success.key);
        if (okValue === success.value) {
          if (!_.isEmpty(success.storage)) {
            handlerStorage(req, res, body, success.storage);
          }
          return res.json(body);
        } else {
          if (error) {
            set(body, error.key, error.value);
            if (error.data) {
              for (const [key, value] of Object.entries(
                error.data as IMapItem
              )) {
                set(body, key, value.defaultValue);
              }
            }
          }
          return res.json(body);
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

function handlerStorage(
  req: express.Request,
  res: express.Response,
  data,
  storages: IStorageOption[] = []
) {
  storages.forEach((st) => {
    switch (st.type) {
      case "session":
        const act = sessionAction[st.cmd];
        act && act(req, data, st.data);
        break;
      default:
        break;
    }
  });
}

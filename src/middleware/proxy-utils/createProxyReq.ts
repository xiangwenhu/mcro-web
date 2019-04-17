import express from "express";
import * as http from "http";
import * as querystring from "querystring";
import { getProxyConfigByAppId } from "../../demoConfig";
import { IProxyConfig } from "../../types/IAppConfig";
import { dynamicHeader } from "../../handlers/dynamicHeader";
import { updateWith, reMapping } from "../../utils/common";

export default function createProxyReq(path: string) {
  return function onProxyReq(
    proxyReq: http.ClientRequest,
    req: express.Request,
    res: express.Response
  ) {
    const appId = req.cookies.appId;
    const proxyConfig: IProxyConfig = getProxyConfigByAppId(appId, path);

    if (!proxyConfig) {
      return;
    }

    // 额外的header, 需要读取session或者cookie
    if (proxyConfig.dynamicHeader) {
      dynamicHeader(proxyReq, req, res)(proxyConfig.dynamicHeader);
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
      body = updateWith(body, proxyConfig.extraBody);
      // TODO:: 额外的body, 需要读取session或者cookie

      // 字段重新映射
      body = reMapping(body, proxyConfig.bodyMapping);

      const bodyStr = contentType.includes("application/json")
        ? JSON.stringify(body)
        : querystring.stringify(body);
      proxyReq.setHeader("content-length", Buffer.byteLength(bodyStr));
      proxyReq.write(bodyStr);
      proxyReq.end();
    }
  };
}

import * as http from "http";
import express from "express";
import { get } from "../utils/common";
import { IDynamicObject, sourceType } from "../types/action";
import _ from "lodash";

export function dynamicHeader(
  proxyReq: http.ClientRequest,
  req: express.Request,
  res?: express.Response
) {
  return function(dynamicObj: IDynamicObject) {
    for (const [key, item] of Object.entries(dynamicObj)) {
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
  };
}

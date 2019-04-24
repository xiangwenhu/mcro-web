
import * as http from "http";
import express from "express";
import _ from "lodash";
import { sourceType, IDynamicObject } from "../types/action";
import { get } from "../utils/common";
import BaseAction from "./baseAction";

export default class SetHeader extends BaseAction {

    public excute() {
        // 如果有proxyReq， 表示是代理前设置header, 反之是代理完毕之后
        const options = this.context.options as IDynamicObject;
        const realReq = this.context.proxyReq || this.context.req as http.ClientRequest | express.Response;
        const req = this.context.req as express.Request;
        for (const [key, item] of Object.entries(options)) {
            let val;
            if (item.type === sourceType.cookie) {
                val = get(req.cookies, item.path);
            } else if (item.type === sourceType.session) {
                val = get(req.session, item.path);
            }
            if (!_.isEmpty(val)) {
                // TODO:: val可能不是字符串
                realReq.setHeader(key, val);
            }
        }
    }
}


import * as http from "http";
import express from "express";
import _ from "lodash";
import { sourceType, IDynamicObject } from "../types/action";
import { get } from "../utils/common";

function setHeaders(options: IDynamicObject) {

    const context = this.context as http.ClientRequest | express.Response;
    const req = this.req as express.Request;
    for (const [key, item] of Object.entries(options)) {
        let val;
        if (item.type === sourceType.cookie) {
            val = get(req.cookies, item.path);
        } else if (item.type === sourceType.session) {
            val = get(req.session, item.path);
        }
        if (!_.isEmpty(val)) {
            // TODO:: val可能不是字符串
            context.setHeader(key, val);
        }
    }
}

export default function setContext(context: http.ClientRequest | express.Response, req: express.Request) {
    return setHeaders.bind({
        context,
        req
    });
}

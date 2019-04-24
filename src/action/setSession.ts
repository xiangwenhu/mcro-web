
import express from "express";
import BaseAction from "./baseAction";
import { get, set } from "../utils/common";
import { IMapItem } from "src/types/action";

export default class SetSession extends BaseAction {

    public excute() {
        const req = this.context.req as express.Request;
        const options = this.context.options as IMapItem;
        const body = this.context.body;

        for (const [key, d] of Object.entries(options)) {
            set(req.session, key, get(body, d.path) || d.defaultValue);
        }
    }
}

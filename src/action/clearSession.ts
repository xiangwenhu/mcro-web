
import express from "express";
import _ from "lodash";
import { emptyFunction } from "../utils/common";
import BaseAction from "./baseAction";

export default class ClearSession extends BaseAction {

    public excute() {
        const req = this.context.req as express.Request;
        req.session.destroy(emptyFunction);
    }
}

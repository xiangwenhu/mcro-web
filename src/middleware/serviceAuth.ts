import express from "express";
import { getServiceConfig } from "../demoConfig/index";

const DEFAULT_RES = {
    errCode: 60000,
    code: 60000,
    message: "未授权"
};

export default function serviceAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): any {
    const appId = req.cookies.appId;
    const serviceConfig = getServiceConfig(appId, req.originalUrl);
    if (!serviceConfig && !req.session.logined) {
        return res.json(DEFAULT_RES);
    }

    if (serviceConfig && serviceConfig.auth === false) {
        next();
    } else {
        if (req.session.logined) {
            next();
        } else {
            res.json(serviceConfig.data || DEFAULT_RES);
        }
    }
}

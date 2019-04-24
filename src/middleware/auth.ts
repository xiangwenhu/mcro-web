import express from "express";

const DEFAULT_RES = {
    errCode: 60000,
    code: 60000,
    message: "未授权"
};

export default function auth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): any {
    if (req.session && req.session.logined) {
        next();
    } else {
        res.json(DEFAULT_RES);
    }
}

import ejs from "ejs";
import express from "express";
import fs from "fs";
import path from "path";
import { getConfigById } from "../demoConfig";
import { emptyFunction } from "../utils/common";

export default function preRender(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): any {
  const curPath = req.path;
  if (["/"].includes(curPath)) {
    const appId = req.query.appId;
    const oldAppId = req.cookies.appId;

    if (!appId) {
      res.render("error", {
        title: "错误页面",
        message: "没有先关的appId"
      });
      return;
    }
    if (appId !== oldAppId) {
      req.session.regenerate(emptyFunction);
    }

    const config = getConfigById(appId);
    if (!config) {
      res.render("error", {
        title: "错误页面",
        message: "appId没有配置相关的渲染模板"
      });
      return;
    }

    res.cookie("appId", appId);
    const template = config.template;
    // 这里是预留给配置文件，配置文件html本身可以存储在数据库，或者oss, cdn或者网站上等等
    const buffer = fs.readFileSync(
      path.join(__dirname, "../", "views", template)
    );
    const html = ejs.render(buffer.toString(), {
      domain: config.domain,
      title: config.title
    });
    res.set("Content-Type", "text/html");
    res.send(Buffer.from(html));
    return;
  }
  next();
}

import ejs from "ejs";
import express from "express";
import fs from "fs";
import path from "path";
import { getConfigById } from "../demoConfig";

export default function preRender(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): any {
  const appId = req.cookies.appId;

  if (!appId) {
    return next();
  }

  const config = getConfigById(appId);
  if (!config) {
    res.render("error", {
      title: "错误页面",
      message: "appId没有配置相关的渲染模板"
    });
    return;
  }

  // TODO:: 需要判断是get/post 和请求是什么类型。
  // 可参考：： https://github.com/bripkens/connect-history-api-fallback

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
}

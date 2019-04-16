import express from "express";
import preRender from "./preRender";
import proxy from "./proxy";
import resgiterRouter from "../router";
import afterRender from './afterRender'

export default function register(app: express.Express) {
  // 前置render
  app.use(preRender);
  // 代理
  proxy(app);
  // 注册路由
  resgiterRouter(app);  
  // 后置render
  app.use(afterRender);
  return app;
}

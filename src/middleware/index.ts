import express from "express";
import preRender from "./preRender";
import proxy from "./proxy";

export default function register(app: express.Express) {
  app.use(preRender);
  proxy(app);
  return app;
}

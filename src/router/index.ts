import express from "express";
import * as fs from "fs";

const check = function(req: express.Request, res: express.Response) {
  if (req.session && req.session.logined) {
    return res.json({
      code: 0,
      errCode: 0,
      status: "success"
    });
  }
  return res.json({
    code: 60000
  });
};

const register = async (app: express.Express) => {
  try {
    app.use("/auth/check", check);
    app.use("/api/auth/check", check);
    const files = fs.readdirSync(__dirname);
    files.forEach((filename) => {
      registerSingle(app, `./${filename}`);
    });
  } catch (err) {
    // TODO: 不加会有错误提示
  }
};

function registerSingle(app: express.Express, path: string) {
  const r: express.Router = require(path).default as express.Router;
  const routerName = path
    .split("/")
    .pop()
    .split(".")[0];
  app.use(`/api/${routerName}`, r);
}

export default register;

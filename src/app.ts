import bodyParser from "body-parser";
import express from "express";
import sesssion from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import registerMiddleware from "./middleware";
import resgiterRouter from "./router";

const app: express.Express = express();

const CONFIG: sesssion.SessionOptions = {
  secret: "ANNXJHSHDKSDKSHK++++++S=======///node-admin-platform/",
  resave: false,
  cookie: { maxAge: 30 * 60 * 1000, httpOnly: true },
  name: "express.mf.connect.sid",
  saveUninitialized: true
};

/* 全局设置 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(sesssion(CONFIG));
/*  辅助类中间件 */
app.use(express.static("public"));
app.use(bodyParser.json());

/* 注册定制化中间件  */
registerMiddleware(app);

// 注册路由
resgiterRouter(app);

app.listen(3000);

import express from "express";
import sesssion from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import registerMiddleware from "./middleware";

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
app.use(bodyParser.urlencoded({ extended: false }));
/* 注册定制化中间件  */
registerMiddleware(app);

app.listen(3000, null, () => {
  console.log("listen at port 3000");
});

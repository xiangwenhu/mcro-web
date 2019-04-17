import * as http from "http";

export default function readRes(
  proxyRes: http.IncomingMessage,
  callback: (data: any) => any
) {
  let body: any = Buffer.from("");
  proxyRes.on("data", function(data) {
    body = Buffer.concat([body, data]);
  });
  proxyRes.on("end", function() {
    callback(body);
  });
}

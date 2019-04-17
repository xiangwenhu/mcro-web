// https://stackoverflow.com/questions/30712638/typescript-export-imported-interface

import sessionHandler from "./sessionHandler";
import requestHeaderHandler from "./requestHeaderHandler";
import responseBodyHandler from "./responseBodyHandler";
import requestBodyHandler from "./requestBodyHandler";
import { IHandler } from "../types/handlers";

const handers = {
  sessionHandler,
  requestHeaderHandler,
  requestBodyHandler,
  responseBodyHandler
};

export {
  sessionHandler,
  requestHeaderHandler,
  responseBodyHandler,
  requestBodyHandler
};

export default handers;

export function getHandlerByType(type: string): IHandler | null {
  if (!type) {
    return null;
  }
  return handers[`${type}Handler`] || null;
}

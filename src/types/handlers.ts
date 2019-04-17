import { PropertyPath } from "lodash";
import { IMapItem } from "../types/action";

export interface IResponseHandler {
  type: "response";
  options: {
    success: {
      key: PropertyPath;
      value: string | number;
      data?: IMapItem;
    };
    error?: {
      key: PropertyPath;
      value: string | number;
      data?: IMapItem;
    };
  };
}

export interface ISessionHanlder {
  type: "session";
  options: {
    type: "clear" | "set" | "delete";
    data?: IMapItem;
  };
}

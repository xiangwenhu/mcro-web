import { PropertyPath } from "lodash";

export enum sourceType {
  session = "session",
  cookie = "cookie",
  config = "config",
  custom = "custom"
}

export interface IDynamicItem {
  type: sourceType;
  path: PropertyPath;
}

export interface IDynamicObject {
  [key: string]: IDynamicItem;
}

export interface IMapItem {
  [key: string]: {
    type: sourceType;
    path?: PropertyPath;
    defaultValue?: any;
  };
}

export interface IStorageOption {
  type: "session" | "cookie";
  cmd: "save" | "delete" | "clear";
  data?: IMapItem;
}

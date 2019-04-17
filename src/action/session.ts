import express from "express";
import { IMapItem } from "../types/action";
import { get, set, emptyFunction } from "../utils/common";

export function save(
  req: express.Request,
  data: any = {},
  map: IMapItem
) {
  for (const [key, d] of Object.entries(map)) {
    set(req.session, key, get(data, d.path) || d.defaultValue);
  }
}

export function clear(req: express.Request) {
  req.session.destroy(emptyFunction);
}

export default { save, clear };

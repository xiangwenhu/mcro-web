import _, { PropertyPath } from "lodash";
import { IMapItem } from "../types/common";

export function get(source: any, path: PropertyPath, defaultValue?: any): any {
  return _.get(source, path, defaultValue);
}

export function getAll(source: any, options: IMapItem[] = []): any {
  return options.reduce((obj: any, cur: IMapItem) => {
    _.updateWith(
      obj,
      cur.name,
      _.constant(get(source, cur.path, cur.defaultValue)),
      Object
    );
    return obj;
  }, {});
}

export function set(source: any, path: PropertyPath, value: any): any {
  return _.set(source, path, value);
}

export function setAll(target: any, source: any = {}): any {
  return _.merge(target, source);
}

/**
 * 更新数据
 * @param data 原始数据
 * @param extraData 额外的数据
 */
export function updateWith(data: any, extraData: any = {}) {
  if (!_.isEmpty(extraData)) {
    for (const [key, value] of Object.entries(extraData)) {
      _.updateWith(data, key, _.constant(value), Object);
    }
  }
  return data;
}

/**
 * 更新数据的值
 * @param data 原值数据
 * @param mapping 键值信息
 */
export function reMapping(data: any, mapping: { [key: string]: string }) {
  const d = _.cloneDeep(data);
  if (!_.isEmpty(mapping)) {
    for (const [oldPath, newPath] of Object.entries(mapping)) {
      _.updateWith(data, newPath, _.constant(_.get(d, oldPath)), Object);
    }
    data = _.omit(data, Object.keys(mapping));
  }
  return data;
}

export function emptyFunction() {
  //
}

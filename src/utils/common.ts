import _ from "lodash";

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

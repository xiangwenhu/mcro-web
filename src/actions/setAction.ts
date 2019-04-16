import _, { PropertyPath } from "lodash";

export default function set(
  source: any,
  path: PropertyPath,
  defaultValue?: any
): any {
  return _.set(source, path, defaultValue);
}

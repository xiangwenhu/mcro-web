import _, { PropertyPath } from "lodash";

export default function get(
  source: any,
  path: PropertyPath,
  defaultValue?: any
): any {
  return _.get(source, path, defaultValue);
}


import { reMapping } from "../utils/common";
import BaseAction from "./baseAction";

export default class MapBody extends BaseAction {

    public excute() {
        const options = this.context.options;
        const map = options.map;
        const body = this.context.body;
        reMapping(body, map);
    }
}


import { updateWith } from "../utils/common";
import BaseAction from "./baseAction";

export default class SetBody extends BaseAction {

    public excute() {
        const options = this.context.options;
        const extraBody = options.body;
        const body = this.context.body;
        updateWith(body, extraBody);
    }
}


import { get, set } from "../utils/common";
import BaseAction from "./baseAction";
import { IMapItem } from "../types/action";

export default class ReadResponse extends BaseAction {

    public excute() {
        const body = this.context.body as any;
        const { success, error }: { success: any, error: any } = this.context.options;

        const okValue = get(body, success.key);
        if (okValue === success.value) {
            return body;
        } else {
            if (error) {
                set(body, error.key, error.value);
                if (error.data) {
                    for (const [key, value] of Object.entries(
                        error.data as IMapItem
                    )) {
                        set(body, key, value.defaultValue);
                    }
                }
            }
            return body;
        }
    }
}

export default class BaseAction {
    protected context: any;
    constructor(context) {
        this.context = context;
    }

    public excute(...params: any[]) {
        throw new Error("not implemented");
    }
}

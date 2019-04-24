import _ from "lodash";

import BaseAction from "./baseAction";
import SetHeader from "./setHeader";
import ClearSession from "./clearSession";
import MapBody from "./mapBody";
import SetBody from "./setBody";
import SetSession from "./setSession";
import ReadResponse from "./readResponse";

import { IHandlerOption, IAction } from "../types/handlers";

function generateAction(context: any, action: IAction) {

    const innerContext = { ...context, options: action.options };
    switch (action.type) {
        case "setHeader":
            return new SetHeader(innerContext);
        case "clearSession":
            return new ClearSession(innerContext);
        case "mapBody":
            return new MapBody(innerContext);
        case "setBody":
            return new SetBody(innerContext);
        case "setSession":
            return new SetSession(innerContext);
        case "readResponse":
            return new ReadResponse(innerContext);
        default:
            return null;
    }
}

export function batchActions(context: any, handlerOption: IHandlerOption) {
    if (_.isEmpty(handlerOption) || _.isEmpty(handlerOption.actions)) {
        return Promise.resolve();
    }
    const actions = handlerOption.actions
        .map((actionOptions: IAction) => generateAction(context, actionOptions))
        .filter((action) => action instanceof BaseAction);
    return actions.reduce((params: any, action: BaseAction) => {
        return action.excute(params);
    }, null);
}

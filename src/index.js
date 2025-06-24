"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CU = exports.CautionUtil = void 0;
///<reference path="./type.d.ts"/>
var CautionUtil;
(function (CautionUtil) {
    function never(...args) {
        if (args[2]) {
            let reason = args[2];
            let target = args[0];
            let key = args[1];
            let value = target?.[key];
            throw new Error(`Unhandled reason: ${reason} => get value ${value}`);
        }
        else if (typeof args[1] == "string") {
            let reason = args[1];
            throw new Error(`Unhandled reason: ${reason} => get value ${args[0]}`);
        }
        else {
            throw new Error(`Unhandled reason: ${args[0]}`);
        }
    }
    CautionUtil.never = never;
    function error(reason, ...errors) {
        let messages = [`Reason: ${reason}`];
        for (let error of errors) {
            messages.push(`Caused by: ${error.name}`);
            messages.push(error.message);
        }
        let error = new Error(messages.join("\n"));
        let cur = error;
        for (let next of errors) {
            cur.name = cur.name;
            cur.message = cur.message;
            cur.cause = next;
            cur = next;
        }
        return error;
    }
    CautionUtil.error = error;
    // Just throw, we should decide it latter.
    function tbd(reason, ...errors) {
        if (reason) {
            throw CautionUtil.error(reason, ...errors);
        }
        return;
    }
    CautionUtil.tbd = tbd;
})(CautionUtil || (exports.CautionUtil = CautionUtil = {}));
exports.CU = CautionUtil;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CU = exports.CautionUtil = void 0;
///<reference path="./type.d.ts"/>
var CautionUtil;
(function (CautionUtil) {
    function never(...args) {
        if (typeof args[1] == "string") {
            let reason = args[1];
            throw new Error(`Unhandled reason: ${reason} => get value ${args[0]}`);
        }
        else {
            throw new Error(`Unhandled reason: ${args[0]}`);
        }
    }
    CautionUtil.never = never;
    function error(reason, ...errors) {
        let error = new Error(reason);
        let cur = error;
        for (let next of errors) {
            cur.cause = next;
            cur = next;
        }
        return error;
    }
    CautionUtil.error = error;
})(CautionUtil || (exports.CautionUtil = CautionUtil = {}));
exports.CU = CautionUtil;

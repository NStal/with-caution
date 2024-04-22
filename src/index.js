"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CautionUtil = void 0;
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
})(CautionUtil || (exports.CautionUtil = CautionUtil = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CautionUtil = void 0;
///<reference path="./type.d.ts"/>
var CautionUtil;
(function (CautionUtil) {
    function never(reason) {
        throw new Error(`Unhandled reason: ${reason}`);
    }
    CautionUtil.never = never;
})(CautionUtil || (exports.CautionUtil = CautionUtil = {}));

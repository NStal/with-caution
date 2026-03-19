"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CU = exports.CautionUtil = void 0;
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
        errors = errors.filter(Boolean);
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
            let error = CautionUtil.error(reason, ...errors);
            if (Error["captureStackTrace"]) {
                Error.captureStackTrace(error, CautionUtil.tbd);
            }
            else {
                const dropFrame = 2;
                const lines = error.stack.split('\n');
                const head = lines[0];
                const rest = lines.slice(1 + dropFrame);
                error.stack = [head, ...rest].join('\n');
            }
            throw error;
        }
        return;
    }
    CautionUtil.tbd = tbd;
    function toErrorData(error, keepStack = true) {
        if (!error)
            return null;
        if (typeof error == "string") {
            return {
                name: "Error",
                message: error,
            };
        }
        return {
            name: error.name || "Unknown",
            message: error.message || "",
            stack: keepStack ? error.stack || "" : undefined,
            cause: error.cause ? toErrorData(error.cause) : undefined,
        };
    }
    CautionUtil.toErrorData = toErrorData;
    function toError(like, stackMissingHint) {
        let data = toErrorData(like);
        let error = new Error(data.message, {
            cause: data.cause ? toError(data.cause) : undefined,
        });
        if (data.stack) {
            error.stack += "\n" + data.stack;
        }
        else {
            data.stack += "\n" + (stackMissingHint || "Stack missing from data");
        }
        return error;
    }
    CautionUtil.toError = toError;
    // Assert result to be no error
    function yah(caution) {
        let [res, reason, ...errors] = caution;
        if (reason) {
            let error = CautionUtil.error(reason, ...errors);
            if (Error["captureStackTrace"]) {
                try {
                    delete error.stack;
                }
                catch { }
                Error.captureStackTrace(error, CautionUtil.yah);
            }
            else {
                const dropFrame = 2;
                const lines = error.stack.split('\n');
                const head = lines[0];
                const rest = lines.slice(1 + dropFrame);
                error.stack = [head, ...rest].join('\n');
            }
            throw error;
        }
        return res;
    }
    CautionUtil.yah = yah;
    function res(caution) {
        let [res, reason, ...errors] = caution;
        return res;
    }
    CautionUtil.res = res;
})(CautionUtil || (exports.CautionUtil = CautionUtil = {}));
exports.CU = CautionUtil;
//# sourceMappingURL=caution.js.map
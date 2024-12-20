///<reference path="./type.d.ts"/>
export namespace CautionUtil {
    export function never(reason: never): never;
    export function never(sth: never, reason: string): never;
    export function never(...args: any[]) {
        if (typeof args[1] == "string") {
            let reason = args[1]
            throw new Error(`Unhandled reason: ${reason} => get value ${args[0]}`)
        } else {
            throw new Error(`Unhandled reason: ${args[0]}`)
        }
    }
    export function error(reason: string, ...errors: Error[]) {
        let error = new Error(reason)
        let cur = error
        for (let next of errors) {
            cur.name = cur.name
            cur.message = cur.message
            cur.cause = next
            cur = next
        }
        return error
    }
}
export const CU = CautionUtil

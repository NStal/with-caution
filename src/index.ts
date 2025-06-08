///<reference path="./type.d.ts"/>
export namespace CautionUtil {
    export function never(reason: never): never;
    export function never(sth: never, reason: string): never;
    export function never<T>(target: T, key: keyof T, reason: string): never;
    export function never(...args: any[]) {
        if (args[2]) {
            let reason = args[2]
            let target = args[0]
            let key = args[1]
            let value = target?.[key]
            throw new Error(`Unhandled reason: ${reason} => get value ${value}`)
        }
        else if (typeof args[1] == "string") {
            let reason = args[1]
            throw new Error(`Unhandled reason: ${reason} => get value ${args[0]}`)
        } else {
            throw new Error(`Unhandled reason: ${args[0]}`)
        }
    }
    export function error(reason: string, ...errors: Error[]) {
        let messages = [`Reason: ${reason}`]
        for (let error of errors) {
            messages.push(`Caused by: ${error.name}`)
            messages.push(error.message)
        }
        let error = new Error(messages.join("\n"))
        let cur = error
        for (let next of errors) {
            cur.name = cur.name
            cur.message = cur.message
            cur.cause = next
            cur = next
        }
        return error
    }
    // Just throw, we should decide it latter.
    export function tbd(reason: string, ...errors: Error[]) {
        if (reason) {
            throw CautionUtil.error(reason, ...errors)
        }
        return
    }
}
export const CU = CautionUtil

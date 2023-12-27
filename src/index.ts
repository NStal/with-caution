///<reference path="./type.d.ts"/>
export namespace CautionUtil {
    export function never(reason: never) {
        throw new Error(`Unhandled reason: ${reason}`)
    }
}

declare namespace Caution {
    // We have intentded thrown, or unintended.
    type Res<T = any, TReason extends string = string, TError extends Error = Error> = [T, TReason?, ...TError[]]
    type WithCautionFunction<T = any, TReason extends string = string, TError extends Error = Error> = ((...args: any[]) => Res<T, TReason, TError>) | ((...args: any[]) => Promise<Res<T, TReason, TError>>)
    type ReasonOf<TFn extends WithCautionFunction> = TFn extends (...args: any[]) => Res<any, infer R, any> ? R
        : never | TFn extends (...args: any[]) => Promise<Res<any, infer R>> ? R : never;
    //type ErrorOf<TRes extends Res> = TRes extends [any, any?, ...infer R] ? R : never;
    type ErrorOf<TFn extends WithCautionFunction> = TFn extends (...args: any[]) => Res<any, any, infer R> ? R : never;
    type Checked<T = any> = T & {
        _checked: never
    }
    type CautionFunction<TInput, TResult, TReason extends string = string, TError extends Error = Error> = (option: TInput, ...args: any[]) => Promise<Res<TResult, TReason, TError>>
    type ExtendReason<TReason extends string, TCautionFunction extends CautionFunction<any, any, any, any>> =
        TCautionFunction extends CautionFunction<infer TInput, infer TResult, infer TOriginalReason, infer TError>
        ? CautionFunction<TInput, TResult, TOriginalReason | TReason, TError>
        : never;
    type ReduceReason<TReason extends string, TCautionFunction extends CautionFunction<any, any, any, any>> =
        TCautionFunction extends CautionFunction<infer TInput, infer TResult, infer TOriginalReason, infer TError>
        ? CautionFunction<TInput, TResult, Exclude<TOriginalReason, TReason>, TError>
        : never;

    // Through here means, even all signature matches the input, we may still throw to indicate something wrong about the process.
    // May thrown on error
    type IntentedThrow<T, TError extends Error = Error> = T
    // We never throw here, we silently return null on any kind of error
    type Nully<T> = T | null
    // Eventually all IntendedThrow should be catched and considered.
    // Unintended throw is always an bug, and should always crash the program if affordable.

}
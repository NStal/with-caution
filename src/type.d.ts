declare namespace Caution {
    type Res<T = any, TReason extends string = string, TError extends Error = Error> = [T, TReason?, ...TError[]]
    type WithCautionFunction<T = any, TReason extends string = string, TError extends Error = Error> = ((...args: any[]) => Res<T, TReason, TError>) | ((...args: any[]) => Promise<Res<T, TReason, TError>>)
    type ReasonOf<TFn extends WithCautionFunction> = TFn extends (...args: any[]) => Res<any, infer R, any> ? R
        : never | TFn extends (...args: any[]) => Promise<Res<any, infer R>> ? R : never;
    //type ErrorOf<TRes extends Res> = TRes extends [any, any?, ...infer R] ? R : never;
    type ErrorOf<TFn extends WithCautionFunction> = TFn extends (...args: any[]) => Res<any, any, infer R> ? R : never;
    type Checked<T = any> = T & {
        _checked: never
    }
}
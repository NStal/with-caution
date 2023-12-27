declare namespace Caution {
    type Res<T = any, TReason extends string = string, TError extends Error = Error> = [T, TReason?, ...TError[]]
    type ReasonOf<TRes extends Res> = TRes[1]
    type ErrorOf<TRes extends Res> = TRes extends [any, any?, ...infer R] ? R : never;
}
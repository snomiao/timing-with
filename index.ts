// util util util util util util util util util util util util util util util
type Awaitable<R> = Promise<R> | R;
type Repromise<T> = Promise<Awaited<T>>;
// type type type type type type type type type type type type type type type
// prettier-ignore
type $<
  MSG extends string
            = string,
  FUN extends (...args: any[]) => unknown
            = (...args: any[]) => unknown,
  ARG extends Parameters<FUN>
            = Parameters<FUN>,
  RET extends Repromise<ReturnType<FUN>>
            = Repromise<ReturnType<FUN>>
> = [RET, MSG, FUN, ARG];
// impl impl impl impl impl impl impl impl impl impl impl impl impl impl impl
function _timingWith<
  A extends $[1],
  B extends $<A>[2],
  C extends $<A, B>[3],
  Z extends $<A, B, C>[0]
>(msg: A, fn: B, ...args: C): Promise<Z> {
  if (!fn)
    // @ts-expect-error curried
    return (fn: B, ...args: C) => _timingWith(msg, fn, ...args) as any;
  if (fn && args.length < fn.length) {
    const r = (...args: C) => _timingWith(msg, fn, ...args) as any;
    // @ts-expect-error curried
    return r;
  }
  return (async function () {
    console.time(msg);
    const result = await fn(...args);
    console.timeEnd(msg);
    return result as Z;
  })();
}
// export export export export export export export export export export expo
export const timingWith = _timingWith as CURRIED;
// prettier-ignore
type CURRIED = (
<A extends $[1], B extends $<A>[2], C extends $<A, B>[3]>(msg: A, fn: B, ...args: C) => $<A, B, C>[0]) & (
<A extends $[1], B extends $<A>[2]>(msg: A, fn: B) =>
<C extends $<A, B>[3]>(...args: C) => $<A, B, C>[0]) & (
<A extends $[1]>(msg: A) => ((
<B extends $<A>[2], C extends $<A, B>[3]>(fn: B, ...args: C) => $<A, B, C>[0]) & (
<B extends $<A>[2]>(fn: B) =>
<C extends $<A, B>[3]>(...args: C) => $<A, B, C>[0])))

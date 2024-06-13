import prettyMs, { Options } from "pretty-ms";
// util util util util util util util util util util util util util util util
type Repromise<T> = Promise<Awaited<T>>;
type TimingLogOptions = Options & {
  msg: string;
  onStart?: (ms: number) => void;
  onEnd?: (ms: number) => void;
  log?: typeof console.log | null;
};
// type type type type type type type type type type type type type type type
// prettier-ignore
type $<
  MSG extends string|TimingLogOptions
            = string|TimingLogOptions,
  FUN extends (...args: any[]) => unknown
            = (...args: any[]) => unknown,
  ARG extends Parameters<FUN>
            = Parameters<FUN>,
  RET extends Repromise<ReturnType<FUN>>
            = Repromise<ReturnType<FUN>>
> = [RET, MSG, FUN, ARG];
// impl impl impl impl impl impl impl impl impl impl impl impl impl impl impl
function _timingLogWith<
  A extends $[1],
  B extends $<A>[2],
  C extends $<A, B>[3],
  Z extends $<A, B, C>[0]
>(opt: A, fn: B, ...args: C): Promise<Z> {
  if (!fn)
    // @ts-expect-error curried
    return (fn: B, ...args: C) => _timingLogWith(opt, fn, ...args) as any;
  if (fn && args.length < fn.length) {
    const r = (...args: C) => _timingLogWith(opt, fn, ...args) as any;
    // @ts-expect-error curried
    return r;
  }
  const options: TimingLogOptions =
    typeof opt === "object" ? opt : { msg: opt };
  const log = options.log || console.log;
  const promise = (async function () {
    const s = +new Date();
    options.onStart?.(s);
    const result = await fn(...args);
    const e = +new Date();
    options.onEnd?.(e);
    log?.(`[${prettyMs(e - s, options)}] ${options.msg}`);
    return result as Z;
  })();
  return promise;
}
// export export export export export export export export export export expo
export const timingLogWith = _timingLogWith as CURRIED;
// prettier-ignore
type CURRIED = (
<A extends $[1], B extends $<A>[2], C extends $<A, B>[3]>(msg: A, fn: B, ...args: C) => $<A, B, C>[0]) & (
<A extends $[1], B extends $<A>[2]>(msg: A, fn: B) =>
<C extends $<A, B>[3]>(...args: C) => $<A, B, C>[0]) & (
<A extends $[1]>(msg: A) => ((
<B extends $<A>[2], C extends $<A, B>[3]>(fn: B, ...args: C) => $<A, B, C>[0]) & (
<B extends $<A>[2]>(fn: B) =>
<C extends $<A, B>[3]>(...args: C) => $<A, B, C>[0])))

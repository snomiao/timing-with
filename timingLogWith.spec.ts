import { timingLogWith as tLog } from "./timingLogWith";
import { expectTypeOf } from "expect-type";
it("works in slot3", async () => {
  const r1 = await tLog("hello", async (a: string) => 123, "asdf");
  expectTypeOf(r1).toEqualTypeOf<number>();
  const r2 = await tLog("hello", async (a: number) => 123, 1234);
  expectTypeOf(r2).toEqualTypeOf<number>();
  const r3 = await tLog("hello", async (a: number) => "123", 1234);
  expectTypeOf(r3).toEqualTypeOf<string>();
  const r4 = await tLog("hello", async (a: number) => 123, 1234);
  expectTypeOf(r4).toEqualTypeOf<number>();
  const r5 = await tLog("hello", async (a: number) => "123", 1234);
  expectTypeOf(r5).toEqualTypeOf<string>();
  const r6 = await tLog("hello", async (a: number) => 123, 1234);
  expectTypeOf(r6).toEqualTypeOf<number>();
  const r9 = await tLog("hello", async (a) => 1 as unknown, 1234);
  expectTypeOf(r9).toEqualTypeOf<unknown>();
  // num
  const withoutArgs = await tLog("hello", () => 123);
  expectTypeOf(withoutArgs).toEqualTypeOf<number>();
  const r7: number = await tLog("hello", async () => 123 as any);
  expectTypeOf(r7).toEqualTypeOf<number>();
  expect(r7).toBe(123);
  // obj
  const r8 = await tLog("hello", () => ({ a: 123 }));
  expectTypeOf(r8).toEqualTypeOf<{ a: number }>();
  expect(r8.a).toBe(123);
});
it("works in slot2", async () => {
  let i = 0;
  const f1 = tLog("hello", async (a: number) => `${a}/${++i}`);
  expectTypeOf(f1).not.toEqualTypeOf<any>();
  expectTypeOf(f1).not.toEqualTypeOf<unknown>();
  expect(await f1(1)).toBe("1/1");
  expect(await f1(5)).toBe("5/2");
  expectTypeOf(await f1(1)).toEqualTypeOf<string>();

  const f2 = tLog("hello", async (a: number) => `${a}/${++i}`);
  expectTypeOf(f2).not.toEqualTypeOf<(...args: any) => Promise<any>>();
  expectTypeOf(f2).not.toEqualTypeOf<any>();
  expectTypeOf(f2).not.toEqualTypeOf<unknown>();
  expect(await f2(1)).toBe("1/4");
  expect(await f2(5)).toBe("5/5");
  expectTypeOf(await f2(1)).toEqualTypeOf<string>();

  const f3 = tLog("hello", async (a: number) => 123);
  await f3(1234);
  const f4 = tLog("hello", async (a) => 123);
  await f4("zxcv");

  const fStr1 = tLog("hello", <T>(a: T): T => a);
  const r1 = await fStr1("abc");
  //   expectTypeOf(r1).toEqualTypeOf<string>();
  expectTypeOf(r1).toEqualTypeOf<unknown>(); // the relation of <T> and <R> is lost

  const fStr2 = tLog("hello", (a: string) => a);
  expectTypeOf(await fStr2("abc")).toEqualTypeOf<string>();
  const fStr3 = tLog("hello", (a) => String(a));
  expectTypeOf(await fStr3("abc")).toEqualTypeOf<string>();
  expectTypeOf(await fStr3(123)).toEqualTypeOf<string>();

  const fUnknown = tLog("hello", <T>(a: T) => a);
  const abc = await fUnknown("abc");
  expectTypeOf(abc).toEqualTypeOf<unknown>();

  const fAny = tLog("hello", <T>(a: T) => a as any);
  expectTypeOf(await fAny("abc")).toEqualTypeOf<any>();

  const fAny2 = tLog("hello", <T>(a: T) => a as any);
  expectTypeOf(await fAny2("abc")).toEqualTypeOf<any>();

  const fAny3 = tLog("hello", <T>(a: T) => a);
  expectTypeOf(await fAny3("abc" as any)).toEqualTypeOf<unknown>();

  const rWithoutArgs = await tLog("hello", () => 123);
  expectTypeOf(rWithoutArgs).toEqualTypeOf<number>();
});

it("works in slot1", async () => {
  let i = 0;
  const timingWith = tLog("hello");
  const f2 = timingWith((a: number) => `${a}/${++i}`);
  expectTypeOf(f2).not.toEqualTypeOf<any>();
  expectTypeOf(f2).not.toEqualTypeOf<unknown>();
  expectTypeOf(await f2(123)).toEqualTypeOf<string>();
  expect(await f2(2)).toBe("2/2");
  expect(await f2(5)).toBe("5/3");

  const resultWithoutArgs = await timingWith(() => 123);
  expectTypeOf(resultWithoutArgs).toEqualTypeOf<number>();
  expect(resultWithoutArgs).toBe(123);

  const CachedWith1 = tLog("hello");
  const v1 = await CachedWith1((a: number) => `${a}/${++i}`, 123);
  expectTypeOf(v1).toBeString();
  const CachedWith2 = tLog("hello");
  const v2 = await CachedWith2((a: number) => `${a}/${++i}`, 123);
  expectTypeOf(v2).toBeString();
  const v3 = await CachedWith2((a: string) => `${a}/${++i}`, "123");
  expectTypeOf(v3).toBeString();
});

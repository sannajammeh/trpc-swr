import assert from "node:assert";
import { unstable_serialize, createSSRHelpers } from "@trpc-swr/ssr";
import { unstable_serialize as swr_unstable_serialize } from "swr";
import { appRouter } from "../utils";
import { test, describe } from "vitest";

describe("unstable_serialize", async () => {
  await test("Should serialize a string key", () => {
    assert.equal(unstable_serialize("/api/users"), "/api/users");
    assert.equal(
      unstable_serialize("01GXTWZRVVFX1VDV8FC46S9280"),
      "01GXTWZRVVFX1VDV8FC46S9280"
    );
  });

  await test("Should serialize an array key", () => {
    assert.equal(unstable_serialize(["/api/users"]), `@"/api/users",`);
  });

  await test("Should serialize an object key", () => {
    assert.equal(unstable_serialize({ id: 1 }), "#id:1,");
  });

  await test("Should match SWR serialization for string", () => {
    assert.equal(
      unstable_serialize("/api/users"),
      swr_unstable_serialize("/api/users")
    );
  });

  await test("Should match SWR serialization for array", () => {
    assert.equal(
      unstable_serialize(["/api/users"]),
      swr_unstable_serialize(["/api/users"])
    );
  });

  await test("Should match SWR serialization for object", () => {
    assert.equal(
      unstable_serialize({ id: 1 }),
      swr_unstable_serialize({ id: 1 })
    );
  });

  await test("Should match SWR serialization for object with array", () => {
    assert.equal(
      unstable_serialize({ id: 1, arr: [1, 2, 3] }),
      swr_unstable_serialize({ id: 1, arr: [1, 2, 3] })
    );
  });

  await test("Should match SWR serialization for array with object and string", () => {
    assert.equal(
      unstable_serialize([1, { id: 1 }, "test"]),
      swr_unstable_serialize([1, { id: 1 }, "test"])
    );
  });

  test("Should match SWR serialization behavior for same keys", () => {
    const ourKey = unstable_serialize([1, { id: 1 }, "test"]);
    const swrKey = unstable_serialize([1, { id: 1 }, "test"]);

    assert.equal(ourKey, swrKey);
    assert.equal(unstable_serialize(ourKey), unstable_serialize(swrKey));
  });
});

const createSSG = () => {
  return createSSRHelpers({
    router: appRouter,
    ctx: {} as any,
  });
};

describe("createSSRHelpers", async () => {
  await test("Should return a proxy object", () => {
    const ssg = createSSG();

    assert.equal(typeof ssg, "function");
  });

  await test("Should access route", async () => {
    const ssg = createSSG();
    const expected_key = '@"hello",';
    assert.equal(typeof ssg.hello, "function");

    assert.equal(ssg.hello.getKey(), expected_key);
  });

  await test("Should fetch from procedure", async () => {
    const ssg = createSSG();

    const result = await ssg.hello();

    assert.equal(result, "world");
  });

  await test("Should dehydrate from procedure when paralell fetch", async () => {
    const ssg = createSSG();

    ssg.hello();

    const result = await ssg.dehydrate();

    assert.deepEqual(result, { [ssg.hello.getKey()]: "world" });
  });

  await test("Should dehydrate from procedure", async () => {
    const ssg = createSSG();

    const fetchResult = await ssg.hello();

    assert.equal(fetchResult, "world");

    const result = await ssg.dehydrate();

    assert.deepEqual(result, { [ssg.hello.getKey()]: "world" });
  });
});

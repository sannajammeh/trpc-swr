import { unstable_serialize } from "swr";
import { describe, it, expect } from "vitest";
import { trpc } from "../utils";

describe("Standalone getKey", () => {
  it("Creates a serialized key", () => {
    const key = trpc.hello.getKey();
    expect(key).toBe(unstable_serialize(["hello"]));

    const input = { id: 1 };
    const key2 = trpc.user.get.getKey({ id: 1 });
    expect(key2).toBe(unstable_serialize(["user.get", input]));
  });

  it("Creates an unserialized key", () => {
    const key = trpc.hello.getKey(void 0, true);
    expect(key).toEqual(["hello"]);

    const key2 = trpc.user.get.getKey({ id: 1 }, true);
    expect(key2).toEqual(["user.get", { id: 1 }]);
  });

  it("Should throw when non-boolean is provided to unserialized", () => {
    expect(() => {
      trpc.hello.getKey(void 0, 1 as any);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Expected second argument to be a boolean"`
    );
  });
});

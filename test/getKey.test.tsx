import { unstable_serialize } from "swr";
import { describe, it } from "vitest";
import { render, screen, trpc, waitFor } from './utils'

describe("Standalone getKey", () => {
    it("Creates a serialized key", () => {
        const key = trpc.hello.getKey();
        expect(key).toBe(unstable_serialize(["hello"]));
    
        const input = { id: 1 };
        const key2 = trpc.user.get.getKey({ id: 1 });
        expect(key2).toBe(unstable_serialize(["user.get", input]));
    })
    
    it("Creates an unserialized key", () => {
        const key = trpc.hello.getKey(void 0, true);
        expect(key).toEqual(["hello"]);
    
        const key2 = trpc.user.get.getKey({ id: 1 }, true);
        expect(key2).toEqual(["user.get", { id: 1 }]);
    })
});



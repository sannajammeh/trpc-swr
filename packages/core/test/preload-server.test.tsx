import { httpBatchLink } from "@trpc/client";
import getPort from "get-port";
import { describe } from "vitest";
import { createSWRProxyHooks } from "../src";
import type { AppRouter } from "./router";

describe("Server side env", () => {
  it("Should not preload if window is not defined", async () => {
    const trpc = createSWRProxyHooks<AppRouter>({
      links: [httpBatchLink({ url: `http://localhost:${await getPort()}` })],
    });
    const originalWindow = globalThis.window;
    (globalThis as any).window = undefined;
    const resolved = await trpc.preloadTest.exec.preload();
    expect(resolved).toBe(undefined);

    globalThis.window = originalWindow;
  });
});

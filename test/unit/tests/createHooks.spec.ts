import { httpBatchLink } from "@trpc/client";
import { describe, it, expect } from "vitest";
import { createSWRHooks, createSWRProxyHooks } from "@trpc-swr/client";
import { AppRouter } from "../server";
import { getUrl } from "../utils";

describe("tRPC-swr proxy hooks creator", () => {
  it("Should create the proxy hooks using config", async () => {
    const trpc = createSWRProxyHooks<AppRouter>({
      links: [httpBatchLink({ url: await getUrl() })],
    });

    expect(trpc).toBeTruthy();
    expect(trpc.hello.getKey).toBeTruthy();
  });

  it("Should not do anything when called directly", async () => {
    const trpc = createSWRProxyHooks<AppRouter>({
      links: [httpBatchLink({ url: await getUrl() })],
    });

    expect((trpc as any)()).toBe(undefined);
  });
});

describe("tRPC-swr regular hooks creator", () => {
  it("Should create the regular hooks using config", async () => {
    const trpc = createSWRHooks<AppRouter>({
      links: [httpBatchLink({ url: await getUrl() })],
    });

    expect(trpc).toBeTruthy();
    expect(trpc.useSWR).toBeTruthy();
  });
});

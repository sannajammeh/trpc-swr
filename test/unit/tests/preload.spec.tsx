import { useEffect, useState } from "react";
import { fireEvent, getUrl, render, screen, trpc } from "../utils";
import { createSWRProxyHooks } from "@trpc-swr/client";
import { httpLink } from "@trpc/client";
import { AppRouter } from "../server";
import { it, describe, expect } from "vitest";

describe("Server side env", () => {
  it("Should not preload if window is not defined", async () => {
    const trpc = createSWRProxyHooks<AppRouter>({
      links: [httpLink({ url: await getUrl() })],
    });
    const originalWindow = globalThis.window;
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    globalThis.window = undefined!;
    const resolved = await trpc.preloadTest.exec.preload();
    expect(resolved).toBe(undefined);
    globalThis.window = originalWindow;
  });
});

describe("[endpoint].preload", () => {
  it("First paint count should be the count preloaded", async () => {
    const Page = () => {
      const { data } = trpc.preloadTest.exec.useSWR();

      return (
        <div>
          <span>data:{data?.text}</span>
          <span data-testid="count-stat">count:{data?.count}</span>
        </div>
      );
    };

    // SWR has no return type on preload...
    const count = ((await trpc.preloadTest.exec.preload()) as any).count;
    expect(count).toBe(1);

    render(<Page />);

    await screen.findByText("data:foo");
    const elem = await screen.findByTestId("count-stat");
    const [, newCount] = elem?.textContent?.split(":") ?? [];

    expect(Number(newCount)).toBe(1);
  });

  it("Should avoid preloading the resource multiple times", async () => {
    const Page = () => {
      const { data } = trpc.preloadTest.exec.useSWR();

      return (
        <div>
          <span>data:{data?.text}</span>
          <span data-testid="count-stat">count:{data?.count}</span>
        </div>
      );
    };

    // Preload in paralell
    const paralell = [
      trpc.preloadTest.exec.preload(),
      trpc.preloadTest.exec.preload(),
      trpc.preloadTest.exec.preload(),
    ];

    await Promise.all(paralell);

    render(<Page />);

    await screen.findByText("data:foo");
    const elem = await screen.findByTestId("count-stat");
    const [, newCount] = elem?.textContent?.split(":") ?? [];

    expect(Number(newCount)).toBe(1);
  });

  it("Should preload resource in effects", async () => {
    const Comp = () => {
      const { data } = trpc.preloadTest.exec.useSWR();

      return (
        <div>
          <span>data:{data?.text}</span>
          <span data-testid="count-stat">count:{data?.count}</span>
        </div>
      );
    };

    const Page = () => {
      const [show, setShow] = useState(false);
      const [count, setCount] = useState<any>(0);
      useEffect(() => {
        trpc.preloadTest.exec.preload().then((count) => {
          setCount((count as any).count);
        });
      }, []);

      return show ? (
        <Comp />
      ) : (
        <button data-testid="click-btn" onClick={() => setShow(true)}>
          click:{count}
        </button>
      );
    };

    render(<Page />);
    const elem = await screen.findByText("click:1");

    fireEvent.click(elem);

    await screen.findByText("data:foo");
    const elem2 = await screen.findByTestId("count-stat");
    const [, newCount] = elem2?.textContent?.split(":") ?? [];

    expect(Number(newCount)).toBe(1);
  });
});

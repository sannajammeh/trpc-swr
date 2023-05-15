import { beforeAll, describe, expect, it } from "vitest";
import { CreateTRPCSWRNextProxy, createTRPCSWRNext } from "@trpc-swr/next";
import { AppRouter } from "../server";
import { httpBatchLink } from "@trpc/client";
import { getUrl, screen } from "../utils";
import { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { useSWRConfig } from "swr";

let trpcNext: CreateTRPCSWRNextProxy<AppRouter>;

const createApi = async () => {
  const url = await getUrl();
  return createTRPCSWRNext({
    links: [
      httpBatchLink({
        url: url,
        headers: () => ({
          "x-test": "test",
        }),
      }),
    ],
  });
};

beforeAll(async () => {
  trpcNext =
    (await createApi()) as unknown as CreateTRPCSWRNextProxy<AppRouter>;
});

describe("createTRPCSWRNext", () => {
  it("Has withNext method", () => {
    expect(typeof trpcNext.withTRPC).toBeDefined();
  });

  it("Can access trpcSWRClient methods", () => {
    expect(typeof trpcNext.hello.useSWR).toBeDefined();
  });
});

describe("withTRPC", async () => {
  const trpcNext: CreateTRPCSWRNextProxy<AppRouter> =
    (await createApi()) as any;
  const MyApp = ({ children }: PropsWithChildren<{}>) => {
    return <>{children}</>;
  };
  const FakeApp = trpcNext.withTRPC(MyApp);

  const Component = () => {
    const { fallback } = useSWRConfig();

    return (
      <>
        <span data-testid="fallback" data-state={JSON.stringify(fallback)} />
      </>
    );
  };

  const NextRenderer = ({ pageProps }: any) => {
    return (
      <FakeApp pageProps={pageProps}>
        <Component />
      </FakeApp>
    );
  };

  it("Can render with fallback", async () => {
    const key = trpcNext.hello.getKey();
    const ssgDehydratedResponse = {
      [key]: "world",
    };
    const pageProps = {
      swr: ssgDehydratedResponse,
    };
    render(<NextRenderer pageProps={pageProps} />);

    expect(screen.getByTestId("fallback").getAttribute("data-state")).toBe(
      JSON.stringify(ssgDehydratedResponse)
    );
  });
});

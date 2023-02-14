import { render } from "@testing-library/react";
import { httpBatchLink, TRPCClient } from "@trpc/client";
import getPort from "get-port";
import { describe } from "vitest";
import { AppRouter } from "./router";
import { screen, trpc, waitFor } from "./utils";

let client: TRPCClient<AppRouter>;

beforeEach(async () => {
  const url = `http://localhost:${await getPort()}`;
  client = trpc.createClient({
    links: [
      httpBatchLink({
        url: url,
        headers: () => ({
          "x-test": "test",
        }),
      }),
    ],
  });
});

describe("tRPC.createClient()", () => {
  it("Should create the client from the default config", () => {
    const client = trpc.createClient();

    expect(client).toBeDefined();

    expect(client.query).toBeDefined();
    expect(client.mutation).toBeDefined();
  });

  it("Should create the client from the custom config", async () => {
    expect(client).toBeDefined();

    expect(client.query).toBeDefined();
    expect(client.mutation).toBeDefined();

    const Page = () => {
      const { data, isLoading, error } = trpc.xTest.useSWR();
      console.log(
        "🚀 ~ file: createClient.spec.tsx ~ line 35 ~ Page ~ error",
        error
      );
      console.log(
        "🚀 ~ file: createClient.spec.tsx ~ line 35 ~ Page ~ data",
        data
      );

      return (
        <div>
          {data && !isLoading ? (
            <p data-testid="x">{data.header}</p>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      );
    };

    render(<Page />, {
      wrapper: ({ children }) => {
        return <trpc.Provider client={client}>{children}</trpc.Provider>;
      },
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(async () => {
      await sleep(10);
    });
    // await waitFor(() => {
    // 	expect(screen.getByTestId('test')).toBeInTheDocument()
    // })
  });
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

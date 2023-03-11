import { useEffect } from "react";
import { expect, it } from "vitest";
import { render, screen, trpc, waitFor } from "./utils";

it("refetches query", async () => {
  let renderCount = 0;

  const Component = () => {
    const { data, mutate } = trpc.user.get.useSWR({ id: 1 }); // 1st render
    const { trigger } = trpc.user.changeName.useSWRMutation();

    renderCount += 1;

    useEffect(() => {
      if (!data) {
        setTimeout(() => {
          (async () => {
            const result = await trigger({
              // Triggers render in useSWRMutation (second render)
              id: 1,
              name: "baz",
            });

            mutate(result); // Third render
          })();
        }, 10);
      }
    }, [data]);

    return <p>{data ? data.name : "User not found"}</p>;
  };

  render(<Component />);

  expect(screen.getByText("User not found")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("baz")).toBeInTheDocument();
  });

  expect(renderCount).toBe(3);
});

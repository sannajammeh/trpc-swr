import { it } from "vitest";
import { createSWRInfiniteProxy } from "../infinite/index";
import { render, screen, trpc, userEvent, waitFor } from "./utils";

it("Makes infinite query using custom page size", async () => {
	const infinite = createSWRInfiniteProxy(trpc);

	const Component = () => {
		const { data, setSize, size } = infinite.people.getMany.use(
			(index, previousPageData) => {
				if (index !== 0 && !previousPageData?.length) return null; // Last page
				return { limit: 1, page: index };
			},
		);

		if (!data) {
			return <div>Loading...</div>;
		}

		const people = data.flatMap((page) => page);

		const hasMore = (data.at(-1) ?? []).length > 0;

		return (
			<>
				<div>
					{people.map((user, index) => {
						return (
							<p key={user.name} data-testid={String(index)}>
								{user.name}
							</p>
						);
					})}
				</div>

				{hasMore && (
					<button onClick={() => setSize(size + 1)}>Load More</button>
				)}
				{!hasMore && <p data-testid="no-more">No more</p>}
			</>
		);
	};

	render(<Component />);

	expect(screen.getByText("Loading...")).toBeInTheDocument();

	await waitFor(() => {
		expect(screen.getByTestId("0")).toBeInTheDocument();
	});

	await userEvent.click(screen.getByText("Load More"));

	await waitFor(() => {
		expect(screen.getByTestId("0")).toBeInTheDocument();
		expect(screen.getByTestId("1")).toBeInTheDocument();
	});

	await userEvent.click(screen.getByText("Load More"));

	await waitFor(() => {
		expect(screen.getByTestId("0")).toBeInTheDocument();
		expect(screen.getByTestId("1")).toBeInTheDocument();
	});

	await waitFor(() => {
		expect(screen.getByTestId("no-more")).toBeInTheDocument();
	});
});

it("Makes infinite query using custom cursor", async () => {
	const infinite = createSWRInfiniteProxy(trpc);

	const Component = () => {
		const { data, setSize, size } = infinite.people.byCursor.useCursor(
			{},
			(data) => data?.nextCursor,
		);

		if (!data) {
			return <div>Loading...</div>;
		}

		const people = data.flatMap((page) => page.items);
		const hasMore = !!data.at(-1)?.nextCursor;

		return (
			<>
				<div>
					{people.map((user, index) => {
						return (
							<p key={user.name} data-testid={String(index)}>
								{user.name}
							</p>
						);
					})}
				</div>

				{hasMore && (
					<button data-testid="load-more" onClick={() => setSize(size + 1)}>
						Load More
					</button>
				)}
				{!hasMore && <p data-testid="no-more">No more</p>}
			</>
		);
	};

	render(<Component />);

	expect(screen.getByText("Loading...")).toBeInTheDocument();

	await waitFor(() => {
		expect(screen.getByTestId("0")).toBeInTheDocument();
		expect(screen.getByTestId("load-more")).toBeInTheDocument();
	});

	await userEvent.click(screen.getByTestId("load-more"));

	await waitFor(() => {
		expect(screen.getByTestId("0")).toBeInTheDocument();
		expect(screen.getByTestId("1")).toBeInTheDocument();
	});

	await waitFor(() => {
		expect(screen.getByTestId("no-more")).toBeInTheDocument();
	});
});

describe("proxy caller", () => {
	it("Should noop on call", () => {
		const infinite = createSWRInfiniteProxy(trpc);

		expect((infinite as any)()).toBeUndefined();
	});

	it("Should return infinite hook when called directly", () => {
		const infinite = createSWRInfiniteProxy(trpc);

		expect(typeof (infinite as any).use).toEqual("function");
		expect(typeof (infinite as any).useCursor).toEqual("function");
	});
});

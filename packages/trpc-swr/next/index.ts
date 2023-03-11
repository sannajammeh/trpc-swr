import { CreateTRPCClientOptions } from "@trpc/client";
import { AnyRouter } from "@trpc/server";
import { createFlatProxy } from "@trpc/server/shared";
import { createSWRProxyHooks, CreateTRPCSWRProxy } from "trpc-swr";
import { withTRPCNext } from "./provider";

export * from "trpc-swr/ssg";

type CreateTRPCSWRNextProxy<TRouter extends AnyRouter> = {
	withTRPC: (
		App: React.ComponentType<any>,
		// eslint-disable-next-line unicorn/prevent-abbreviations
	) => (props: Record<any, any>) => JSX.Element;
} & CreateTRPCSWRProxy<TRouter>;

export function createTRPCSWRNext<TRouter extends AnyRouter>(
	config: CreateTRPCClientOptions<TRouter>,
) {
	const proxyHooks = createSWRProxyHooks(config);

	const utils = {
		withTRPC: (App: React.ComponentType<any>) => {
			return withTRPCNext(config, proxyHooks)(App);
		},
	};

	return createFlatProxy<CreateTRPCSWRNextProxy<TRouter>>((key) => {
		if (key in utils) {
			return utils[key as keyof typeof utils];
		}
		return proxyHooks;
	});
}

export { withTRPCSWR } from "./provider";

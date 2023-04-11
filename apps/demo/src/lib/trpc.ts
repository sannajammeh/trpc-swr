import { AppRouter } from "@/server/_app";
import { createSWRProxyHooks } from "@trpc-swr/core";
import { httpBatchLink } from "@trpc/client";

export const api = createSWRProxyHooks<AppRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
		}),
	],
});

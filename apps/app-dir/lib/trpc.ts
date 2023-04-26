import { AppRouter } from "@/server/_app";
import { createSWRProxyHooks } from "@trpc-swr/client";
import { httpBatchLink } from "@trpc/client";

export const api = createSWRProxyHooks<AppRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
		}),
	],
});

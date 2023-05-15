import type { AppRouter } from "@/server/_app";
import { createTRPCSWRNext } from "@trpc-swr/next";
import { httpBatchLink } from "@trpc/client";

export const nextApi = createTRPCSWRNext<AppRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
		}),
	],
})
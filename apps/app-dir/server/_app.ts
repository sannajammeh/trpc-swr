import { createProxySSGHelpers } from "@trpc-swr/ssr";
import { publicProcedure, router } from "./server";
import { z } from "zod";
import { notificationsRouter } from "./notification";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const appRouter = router({
	notifications: notificationsRouter,
	status: publicProcedure
		.input(z.number().optional())
		.query(async ({ input: delay = 0 }) => {
			await sleep(delay);
			return {
				status: "ok",
			};
		}),

	hello: publicProcedure
		.input(
			z.object({
				name: z.string(),
				delay: z.number().optional(),
			}),
		)
		.query(async ({ input: { name, delay = 0 } }) => {
			await sleep(delay);
			return {
				hello: name,
			};
		}),
});

export type AppRouter = typeof appRouter;

export const createSSG = () => {
	return createProxySSGHelpers({
		router: appRouter,
		ctx: {},
	});
};

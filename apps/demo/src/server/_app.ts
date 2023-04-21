import { createProxySSGHelpers } from "@trpc-swr/ssg";
import { publicProcedure, router } from "./server";
import { userRouter } from "./users";
import { z } from "zod";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const appRouter = router({
	users: userRouter,
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

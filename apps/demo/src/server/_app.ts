import { publicProcedure, router } from "./server";
import { userRouter } from "./users";

export const appRouter = router({
	users: userRouter,
	status: publicProcedure.query(() => {
		return {
			status: "ok",
		};
	}),
});

export type AppRouter = typeof appRouter;

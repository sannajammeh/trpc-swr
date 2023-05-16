import { publicProcedure, router } from "./server";
import * as z from "zod";
import { db, users } from "./db/schema";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const userCreateSchema = z.object({
	name: z.string(),
	delayMs: z.number().optional().default(0),
	throwError: z.boolean().optional().default(false),
});

export const userRouter = router({
	create: publicProcedure
		.input(userCreateSchema)
		.mutation(async ({ input }) => {
			if (input.throwError)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "This is an error",
				});

			const user = db
				.insert(users)
				.values({
					name: input.name,
					createdAt: new Date(),
				})
				.returning()
				.get();

			await delay(input.delayMs);
			return user;
		}),

	byId: publicProcedure
		.input(
			z.object({
				id: z.number(),
				delayMs: z.number().optional().default(0),
			}),
		)
		.query(async ({ input: { id, delayMs } }) => {
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			const result = db.select().from(users).where(eq(users.id, id)).get()!;
			await delay(delayMs);

			return result;
		}),

	all: publicProcedure
		.input(z.number().optional().default(0))
		.query(async ({ input: delayMs }) => {
			const result = db.select().from(users).orderBy(desc(users.id)).all();
			await delay(delayMs);
			return result;
		}),

	reset: publicProcedure
		.input(z.number().optional().default(0))
		.mutation(async ({ input: delayMs }) => {
			db.delete(users).run();
			await delay(delayMs);
			return true;
		}),
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

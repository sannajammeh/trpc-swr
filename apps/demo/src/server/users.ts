import { publicProcedure, router } from "./server";
import * as z from "zod";
import { db, users } from "./db/schema";
import { asc, desc, eq } from "drizzle-orm";

const userCreateSchema = z.object({
	name: z.string(),
});

export const userRouter = router({
	create: publicProcedure
		.input(userCreateSchema)
		.mutation(async ({ input }) => {
			const user = db
				.insert(users)
				.values({
					name: input.name,
					createdAt: new Date(),
				})
				.returning()
				.get();

			await delay(400);
			return user;
		}),

	byId: publicProcedure.input(z.number()).query(async ({ input: id }) => {
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		const result = db.select().from(users).where(eq(users.id, id)).get()!;
		await delay(400);

		return result;
	}),

	all: publicProcedure.query(async () => {
		const result = db.select().from(users).orderBy(desc(users.createdAt)).all();
		await delay(400);
		return result;
	}),

	reset: publicProcedure.mutation(async () => {
		db.delete(users).run();
		await delay(400);
		return true;
	}),
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

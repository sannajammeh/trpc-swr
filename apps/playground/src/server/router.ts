/* eslint-disable unicorn/prevent-abbreviations */
import { faker } from '@faker-js/faker'
import { initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'
import { z } from 'zod'

interface User {
	id: number
	name: string
	cursor?: number
}

const data: { users: User[] } = {
	users: [
		{ id: 0, name: 'foo' },
		{ id: 1, name: 'bar' },
	],
}

const randomUsers = [...Array.from({ length: 10 })].map((_, i) => ({
	id: i,
	name: faker.name.fullName(),
	cursor: i,
}))

const db = new Map<string, Map<number, User>>()
const usersCollection = new Map<number, User>()
db.set('users', usersCollection)

for (const user of randomUsers) {
	usersCollection.set(user.id, user)
}

const t = initTRPC.create({
	transformer: SuperJSON,
})

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const appRouter = t.router({
	hello: t.procedure.query(() => 'world'),
	user: t.router({
		byId: t.procedure
			.input(z.object({ id: z.number() }))
			.query(async ({ input }) => {
				const user = data.users.find((user) => user.id === input.id)
				await delay(10)
				return user ? { name: user.name } : undefined
			}),
		get: t.procedure.query(() => data.users),
		create: t.procedure
			.input(
				z.object({
					name: z.string(),
				}),
			)
			.mutation(({ input }) => {
				const newUser: User = {
					id: data.users.length,
					name: input.name,
				}
				data.users.push(newUser)
				return newUser
			}),

		getMany: t.procedure
			.input(
				z.object({
					limit: z.number().optional(),
					page: z.number().optional(),
				}),
			)
			.query(({ input }) => {
				const { limit = 10, page = 0 } = input

				// eslint-disable-next-line no-unsafe-optional-chaining
				const items: User[] = [...(db as any).get('users')?.values()]

				const itemsToReturn = items.slice(page * limit, (page + 1) * limit)

				return {
					data: itemsToReturn,
					hasMore: items.length > (page + 1) * limit,
				}
			}),

		getManyCursor: t.procedure
			.input(
				z.object({
					limit: z.number().optional(),
					cursor: z.number().optional(),
				}),
			)
			.query(({ input }) => {
				const { limit = 10, cursor = 0 } = input

				// eslint-disable-next-line no-unsafe-optional-chaining
				const items: User[] = [...(db as any).get('users')?.values()]

				const itemsToReturn = items.slice(cursor, cursor + limit + 1)

				let nextCursor: typeof cursor | undefined
				if (itemsToReturn.length > limit) {
					const nextItem = itemsToReturn.pop()
					nextCursor = nextItem?.cursor
				}

				return {
					data: itemsToReturn,
					nextCursor: nextCursor,
				}
			}),
	}),
})

export type AppRouter = typeof appRouter

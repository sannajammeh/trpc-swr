import { faker } from '@faker-js/faker'
import { initTRPC, TRPCError } from '@trpc/server'
import { beforeEach } from 'vitest'

import { z } from 'zod'
import { Context } from './server'

interface User {
	id: number
	name: string
}

const data: { users: User[] } = {
	users: [
		{ id: 0, name: 'foo' },
		{ id: 1, name: 'bar' },
	],
}

export const t = initTRPC.context<Context>().create()

const userRouter = t.router({
	get: t.procedure.input(z.object({ id: z.number() })).query(({ input }) => {
		const user = data.users.find((user) => user.id === input.id)

		if (!user) throw new TRPCError({ code: 'NOT_FOUND' })

		return user
	}),
	create: t.procedure.input(z.object({ name: z.string() })).mutation(({ input }) => {
		const user = { id: data.users.length, name: input.name }

		data.users.push(user)

		return user
	}),
	changeName: t.procedure.input(z.object({ id: z.number(), name: z.string() })).mutation(({ input }) => {
		const user = data.users.find((user) => {
			return user.id === input.id
		})

		if (!user) throw new TRPCError({ code: 'NOT_FOUND' })

		user.name = input.name

		return user
	}),
})

let count = 0

beforeEach(() => {
	count = 0
})

const preloadRouter = t.router({
	exec: t.procedure.query(() => {
		count += 1 // Increase count
		return {
			text: 'foo',
			count,
		}
	}),
})

interface Person {
	id: string
	name: string
	cursor: number
}

const people: Person[] = []
for (const _ of Array.from({ length: 2 })) {
	people.push({
		id: faker.database.mongodbObjectId(),
		name: faker.name.firstName(),
		cursor: faker.datatype.number(),
	})
}

const peopleRouter = t.router({
	getMany: t.procedure.input(z.object({
		limit: z.number().optional(),
		page: z.number().optional(),
	})).query(({ input }) => {
		const { limit = 10, page = 0 } = input

		return [...people].slice(page * limit, (page + 1) * limit)
	}),

	byCursor: t.procedure.input(z.object({
		cursor: z.number().nullish(),
	})).query(({ input }) => {
		const limit = 1 // preset limit
		const { cursor } = input

		/**
		 * EMULATED DB CURSOR LOGIC
		 */

		// Find the index of the cursor if it exists
		const cursorIndex = people.findIndex((person) => person.cursor === cursor)

		// If the cursor exists, return items and nextCursor
		if (cursorIndex !== -1) {
			return {
				items: [...people].slice(cursorIndex, cursorIndex + limit),
				nextCursor: people[cursorIndex + limit]?.cursor ?? null,
			}
		}

		// If the cursor does not exist, return items and nextCursor
		return {
			items: [...people].slice(0, limit),
			nextCursor: people[limit]?.cursor ?? null,
		}
	}),
})

export const appRouter = t.router({
	// this is the "root" query
	hello: t.procedure.query(() => {
		return 'world'
	}),
	xTest: t.procedure.query(({ ctx }) => {
		const xTestHeader = ctx.req.headers['X-Test']

		return {
			header: xTestHeader,
		}
	}),
	user: userRouter,
	people: peopleRouter,
	preloadTest: preloadRouter,
})

export type AppRouter = typeof appRouter

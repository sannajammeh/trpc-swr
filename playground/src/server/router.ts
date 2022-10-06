import { initTRPC } from '@trpc/server'
import { z } from 'zod'

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

const t = initTRPC.create()

export const appRouter = t.router({
	hello: t.procedure.query(() => 'world'),
	user: t.router({
		byId: t.procedure.input(z.object({ id: z.number() })).query(({ input }) => {
			const user = data.users.find((user) => user.id === input.id)

			return user ? { name: user.name } : undefined
		}),
		get: t.procedure.query(() => data.users),
		create: t.procedure.input(z.object({
			name: z.string(),
		})).mutation(({ input }) => {
			const newUser: User = {
				id: data.users.length,
				name: input.name,
			}
			data.users.push(newUser)
			return newUser
		}),
	}),
})

export type AppRouter = typeof appRouter

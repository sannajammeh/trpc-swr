import { router, TRPCError } from '@trpc/server'
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

export const appRouter = router().query('hello', {
	resolve() {
		return 'world'
	},
}).query('user.get', {
	input: z.object({ id: z.number() }),
	async resolve({ input }) {
		const user = data.users.find((user) => user.id === input.id)

		if (!user) throw new TRPCError({ code: 'NOT_FOUND' })

		return { name: user.name }
	},
}).mutation('user.create', {
	input: z.object({
		name: z.string(),
	}),
	async resolve({ input }) {
		const newUser: User = {
			id: data.users.length,
			name: input.name,
		}

		data.users.push(newUser)
		return newUser
	},
}).mutation('user.changeName', {
	input: z.object({
		id: z.number(),
		newName: z.string(),
	}),
	resolve({ input }) {
		const user = data.users.find((user) => user.id === input.id)
		if (!user) throw new TRPCError({ code: 'NOT_FOUND' })

		user.name = input.newName

		return user
	},
})

export type AppRouter = typeof appRouter

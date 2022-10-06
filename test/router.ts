import { initTRPC, TRPCError } from '@trpc/server'

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

export const t = initTRPC.create()

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

export const appRouter = t.router({
	// this is the "root" query
	hello: t.procedure.query(() => {
		return 'world'
	}),
	user: userRouter,
})

export type AppRouter = typeof appRouter

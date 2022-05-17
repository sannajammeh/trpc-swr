import { router } from '@trpc/server'
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

    return user ? { name: user.name } : undefined
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
})

export type AppRouter = typeof appRouter

import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './router'

export const getServer = () => createHTTPServer({ router: appRouter })

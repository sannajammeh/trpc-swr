import { createProxySSGHelpers } from 'trpc-swr/next'
import { appRouter } from './router'

export const createSSG = () => {
	return createProxySSGHelpers({
		router: appRouter,
		ctx: {},
	})
}

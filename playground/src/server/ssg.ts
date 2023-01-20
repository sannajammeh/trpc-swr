import { createProxySSGHelpers } from '../../../src/next'
import { appRouter } from './router'

export const createSSG = () => {
	return createProxySSGHelpers({
		router: appRouter,
		ctx: {},
	})
}

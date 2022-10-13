import { httpBatchLink, loggerLink } from '@trpc/client'
import { createSWRProxyHooks } from '../../../src'
import { createSWRInfiniteProxy } from '../../../src/infinite'
import { AppRouter } from '../server/router'

const getUrl = () => {
	if (typeof window === 'undefined') {
		if (process.env.NODE_ENV === 'development') return 'http://localhost:3000/api/trpc'
		if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/trpc`
		return 'https://localhost:3000/api/trpc'
	}

	return '/api/trpc'
}

export const trpc = createSWRProxyHooks<AppRouter>({
	links: [
		loggerLink({
			enabled() {
				return process.env.NODE_ENV === 'development'
			},
		}),
		httpBatchLink({
			url: getUrl(),
		}),
	],
})

export const infinite = createSWRInfiniteProxy(trpc)

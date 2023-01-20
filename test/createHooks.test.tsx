import { httpBatchLink } from '@trpc/client'
import getPort from 'get-port'
import { describe } from 'vitest'
import { createSWRHooks, createSWRProxyHooks } from '../src'
import type { AppRouter } from './router'

describe('tRPC-swr proxy hooks creator', () => {
	it('Should create the proxy hooks using config', async () => {
		const trpc = createSWRProxyHooks<AppRouter>({
			links: [
				httpBatchLink({ url: `http://localhost:${await getPort()}` }),
			],
		})

		expect(trpc).toBeTruthy()
		expect(trpc.hello.getKey).toBeTruthy()
	})

	it('Should throw when trying to hit invalid proxy arg', async () => {
		const trpc = createSWRProxyHooks<AppRouter>({
			links: [
				httpBatchLink({ url: `http://localhost:${await getPort()}` }),
			],
		})

		expect(() => {
			;(trpc as any)[Symbol('invalid')]
		}).toThrow()
	})

	it('Should not do anything when called directly', async () => {
		const trpc = createSWRProxyHooks<AppRouter>({
			links: [
				httpBatchLink({ url: `http://localhost:${await getPort()}` }),
			],
		})

		expect((trpc as any)()).toBe(undefined)
	})
})

describe('tRPC-swr regular hooks creator', () => {
	it('Should create the regular hooks using config', async () => {
		const trpc = createSWRHooks<AppRouter>({
			links: [
				httpBatchLink({ url: `http://localhost:${await getPort()}` }),
			],
		})

		expect(trpc).toBeTruthy()
		expect(trpc.useSWR).toBeTruthy()
	})
})

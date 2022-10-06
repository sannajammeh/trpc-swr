import { cleanup, render, RenderOptions } from '@testing-library/react'
import { CreateTRPCClientOptions, httpBatchLink } from '@trpc/client'
import getPort from 'get-port'
import { Server } from 'http'
import { useState } from 'react'
import { SWRConfig } from 'swr'
import { afterEach, beforeEach } from 'vitest'
import { createSWRProxyHooks } from '../src'
import { AppRouter } from './router'
import { getServer } from './server'

const createAppRouterSWRHooks = (config: CreateTRPCClientOptions<AppRouter>) => {
	return createSWRProxyHooks<AppRouter>(config);
}

export let trpc: ReturnType<typeof createAppRouterSWRHooks>

let server: Server

beforeEach(async () => {
	const port = await getPort()
	server = getServer().server
	server.listen(port)
	trpc = createAppRouterSWRHooks({
		links: [
			httpBatchLink({ url: `http://localhost:${port}` }),
		],
	})
})

afterEach(() => {
	cleanup()
	server?.close()
})

const customRender = (ui: React.ReactElement, options: RenderOptions = {}) =>
	render(ui, {
		wrapper: ({ children }) => {
			const [client] = useState(() => trpc.createClient());
			return (
				<SWRConfig>
					<trpc.Provider client={client}>{children}</trpc.Provider>
				</SWRConfig>
			)
		},
		...options,
	})

export * from '@testing-library/react'
// override render export
export { customRender as render }
export { default as userEvent } from '@testing-library/user-event'

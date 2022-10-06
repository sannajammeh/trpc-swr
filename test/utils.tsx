import { cleanup, render, RenderOptions } from '@testing-library/react'
import { createTRPCClient, httpBatchLink, TRPCClient } from '@trpc/client'
import getPort from 'get-port'
import { Server } from 'http'
import { afterEach, beforeEach } from 'vitest'
import { createSWRProxyHooks } from '../src'
import { AppRouter } from './router'
import { getServer } from './server'

const createAppRouterSWRHooks = (client: TRPCClient<AppRouter>) => {
	return createSWRProxyHooks<AppRouter>(null, client);
}

let client: TRPCClient<AppRouter>
export let trpc: ReturnType<typeof createAppRouterSWRHooks>

let server: Server

beforeEach(async () => {
	const port = await getPort()
	server = getServer().server;
	server.listen(port);
	
	client = createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({ url: `http://localhost:${port}` })
		]
	})
	trpc = createAppRouterSWRHooks(client)

})

afterEach(() => {
	cleanup()
	server?.close()
})

const customRender = (ui: React.ReactElement, options: RenderOptions = {}) =>
	render(ui, {
		wrapper: ({ children }) => <trpc.Provider client={client}>{children}</trpc.Provider>,
		...options,
	})

export * from '@testing-library/react'
// override render export
export { customRender as render }
export { default as userEvent } from '@testing-library/user-event'

import { cleanup, render, RenderOptions } from '@testing-library/react'
import { createTRPCClient, TRPCClient } from '@trpc/client'
import getPort from 'get-port'
import { Server } from 'http'
import { afterEach, beforeEach } from 'vitest'
import { createSWRHooks } from '../src'
import { AppRouter } from './router'
import { getServer } from './server'

const createAppRouterSWRHooks = () => {
	return createSWRHooks<AppRouter>()
}

let client: TRPCClient<AppRouter>
export let trpc: ReturnType<typeof createAppRouterSWRHooks>

let server: Server

beforeEach(async () => {
	const port = await getPort()
	client = createTRPCClient<AppRouter>({ url: `http://localhost:${port}` })
	trpc = createAppRouterSWRHooks()
	server = getServer().server
	server.listen(port)
})

afterEach(() => {
	cleanup()
	server.close()
})

const customRender = (ui: React.ReactElement, options: RenderOptions = {}) =>
	render(ui, {
		wrapper: ({ children }) => <trpc.TRPCProvider client={client}>{children}</trpc.TRPCProvider>,
		...options,
	})

export * from '@testing-library/react'
// override render export
export { customRender as render }
export { default as userEvent } from '@testing-library/user-event'

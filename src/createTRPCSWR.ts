import { createTRPCClient, CreateTRPCClientOptions, TRPCClient } from '@trpc/client'
import { AnyRouter } from '@trpc/server'
import { createSWRHooks } from './shared/hooks/createSWRHooks'
import { createSWRProxyHooksInternal, CreateTRPCSWRProxy } from './shared/hooks/createSWRProxyHooks'

export function createSWRProxyHooks<TRouter extends AnyRouter>(
	options: CreateTRPCClientOptions<TRouter>,
): CreateTRPCSWRProxy<TRouter>
export function createSWRProxyHooks<TRouter extends AnyRouter>(
	options: null | undefined,
	externalClient: TRPCClient<TRouter>,
): CreateTRPCSWRProxy<TRouter>
export function createSWRProxyHooks<TRouter extends AnyRouter>(
	options?: CreateTRPCClientOptions<TRouter> | null,
	externalClient?: TRPCClient<TRouter>,
) {
	const client = externalClient ?? createTRPCClient(options!)

	const hooks = createSWRHooks(client!)

	const proxy = createSWRProxyHooksInternal(hooks)

	return proxy
}

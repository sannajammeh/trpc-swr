/* eslint-disable unicorn/filename-case */
import { CreateTRPCClientOptions } from '@trpc/client'
import { AnyRouter } from '@trpc/server'
import { createSWRHooks } from './shared/hooks/createSWRHooks'
import { createSWRProxyHooksInternal, CreateTRPCSWRProxy } from './shared/hooks/createSWRProxyHooks'

export function createSWRProxyHooks<TRouter extends AnyRouter>(
	config: CreateTRPCClientOptions<TRouter>,
): CreateTRPCSWRProxy<TRouter> {
	const hooks = createSWRHooks(config)

	const proxy = createSWRProxyHooksInternal(hooks)

	return proxy
}

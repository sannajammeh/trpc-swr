import { TRPCClient } from '@trpc/client'
import { AnyRouter } from '@trpc/server'
import { PropsWithChildren, useContext } from 'react'
import _useSWR, { preload as _preload, SWRConfiguration, unstable_serialize } from 'swr'
import { TRPCContext, TRPCContextType } from '../context'

import _useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation'
import { GetQueryKey } from '../../types'

/**
 * Creates a query key for use inside SWR (unserialized)
 * @internal - Used internally to create a query key
 */
export const getQueryKey: GetQueryKey = (path: string, input: any) => {
	return typeof input === 'undefined'
		? ([path] as const)
		: ([path, input] as const)
}

/**
 * @internal - use this to create custom hooks
 */
export function createSWRHooks<TRouter extends AnyRouter>(
	client: TRPCClient<TRouter>,
): CreateTRPCSWRHooks<TRouter> {
	type TQueries = TRouter['_def']['queries']
	type TSubscriptions = TRouter['_def']['subscriptions']
	type TMutations = TRouter['_def']['mutations']

	const Context = TRPCContext as unknown as React.Context<
		TRPCContextType<TRouter>
	>

	const useSWR = (
		pathAndInput: [string, any],
		config?: SWRConfiguration & {
			isDisabled?: boolean
		},
	) => {
		const { isDisabled, ...swrConfig } = config || {}
		return _useSWR(
			isDisabled ? null : pathAndInput,
			(pathAndInput: ReturnType<GetQueryKey>) => {
				return (client as any).query(...pathAndInput)
			},
			swrConfig,
		)
	}

	const useSWRMutation = (
		path: string,
		config: SWRMutationConfiguration<any, any>,
	) => {
		return _useSWRMutation(
			path,
			(path: any, { arg }: any) => {
				return client.mutation(path, arg)
			},
			config,
		)
	}

	const TRPCProvider = ({
		children,
		client: trpcClient = client,
	}: PropsWithChildren<{ client: TRPCClient<TRouter> }>) => {
		return (
			<Context.Provider
				value={{
					client: trpcClient,
				}}
			>
				{children}
			</Context.Provider>
		)
	}

	const preload = <PreloadData extends ReturnType<GetQueryKey>>(
		pathAndInput: PreloadData,
	) => {
		/**
		 * SWR ??? - why is this not default?
		 */
		if (typeof window === 'undefined') {
			return Promise.resolve()
		}
		return _preload(pathAndInput, (pathAndInput: PreloadData) => {
			return (client as any).query(...pathAndInput)
		})
	}

	const getKey = <PreloadData extends ReturnType<GetQueryKey>>(
		pathAndInput: PreloadData,
		unserialized = false,
	) => {
		return unserialized ? pathAndInput : unstable_serialize(pathAndInput)
	}

	return {
		Provider: TRPCProvider,
		useContext: () => useContext(Context),
		useSWR,
		useSWRMutation,
		preload: preload,
		getKey: getKey,
	}
}

export type TRPCProvider<TRouter extends AnyRouter> = React.FC<
	React.PropsWithChildren<{
		client: TRPCClient<TRouter>
	}>
>

export interface CreateTRPCSWRHooks<TRouter extends AnyRouter> {
	Provider: TRPCProvider<TRouter>
	useContext: () => TRPCContextType<TRouter>
	useSWR: any
	useSWRMutation: any
	getKey: <PreloadData extends readonly [string] | readonly [string, any]>(pathAndInput: PreloadData, unserialized?: boolean) => string | PreloadData,
	preload: (pathAndInput: ReturnType<GetQueryKey>) => Promise<void>
}
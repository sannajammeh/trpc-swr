import { TRPCClient, TRPCClientErrorLike, TRPCRequestOptions } from '@trpc/client'
import { AnyRouter, inferHandlerInput } from '@trpc/server'
import React from 'react'
import _useSWR, { Key, MutatorOptions, SWRConfiguration, SWRResponse, useSWRConfig } from 'swr'
import { TRPCContext, TRPCContextState } from './context'
import { inferProcedures, WrapPromiseAndMutatorCallback } from './types'
import { getClientArguments } from './utils'

export interface UseSWROptions<TData, TError> extends TRPCRequestOptions, SWRConfiguration<TData, TError> {}

type TypeOrFunctionReturnType<T> = T | (() => T)

export function createSWRHooks<TRouter extends AnyRouter>() {
	type TError = TRPCClientErrorLike<TRouter>
	type TQueries = TRouter['_def']['queries']
	type TQueryValues = inferProcedures<TQueries>

	const Context = TRPCContext as React.Context<TRPCContextState<TRouter>>

	const TRPCProvider = ({ client, children }: {
		client: TRPCClient<TRouter>
		children: React.ReactNode
	}) => {
		const { mutate } = useSWRConfig()

		return (
			<Context.Provider
				value={{
					client,
					mutate,
				}}
			>
				{children}
			</Context.Provider>
		)
	}

	const useContext = () => {
		return React.useContext(Context)
	}

	const useSWR = <TPath extends keyof TQueryValues & string>(
		pathAndInput: TypeOrFunctionReturnType<[path: TPath, ...args: inferHandlerInput<TQueries[TPath]>] | null>,
		config?: UseSWROptions<TQueryValues[TPath]['output'], TError>,
	): SWRResponse<TQueryValues[TPath]['output'], TError> => {
		const { client } = useContext()

		return _useSWR(
			pathAndInput,
			// @ts-expect-error normalize args
			() => client.query(...getClientArguments(pathAndInput, config)),
			config,
		)
	}

	return {
		TRPCProvider,
		useContext,
		useSWR,
	}
}

export const getUseMatchMutate = <TRouter extends AnyRouter>() => {
	return () => {
		const { cache, mutate } = useSWRConfig()

		type TQueryValues = inferProcedures<TRouter['_def']['queries']>

		return <
			TPath extends keyof TRouter['_def']['queries'] & string,
		>(
			path: TPath,
			data?: WrapPromiseAndMutatorCallback<TQueryValues[TPath]['output']>,
			opts?: boolean | MutatorOptions<TQueryValues[TPath]['output']>,
		) => {
			if (!(cache instanceof Map)) {
				throw new Error('matchMutate requires the cache provider to be a Map instance')
			}

			const keys: Key[] = []

			for (const key of cache.keys()) {
				if (key.startsWith(`@"${path}`)) {
					keys.push(key)
				}
			}

			const mutations = keys.map((key) => mutate(key, data, opts))
			return Promise.all(mutations)
		}
	}
}

export { TRPCContext }
export type { TRPCContextState }

import { TRPCClientErrorLike, TRPCRequestOptions } from '@trpc/client'
import { AnyRouter, inferHandlerInput } from '@trpc/server'
import { useContext } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration, SWRInfiniteResponse } from 'swr/infinite'
import { TRPCContext, TRPCContextState } from './context'
import { inferProcedures } from './types'
import { getClientArguments } from './utils'

export interface UseSWRInfiniteOptions<TData, TError>
	extends TRPCRequestOptions, SWRInfiniteConfiguration<TData, TError>
{}

export const getUseSWRInfinite = <TRouter extends AnyRouter>() => {
	type TError = TRPCClientErrorLike<TRouter>
	type TQueries = TRouter['_def']['queries']
	type TQueryValues = inferProcedures<TQueries>

	return <
		TPath extends keyof TQueryValues & string,
	>(
		path: TPath,
		getKey: (
			index: number,
			previousPageData: TQueryValues[TPath]['output'] | null,
		) => [...args: inferHandlerInput<TQueries[TPath]>] | null,
		config?: UseSWRInfiniteOptions<TQueryValues[TPath]['output'], TRPCClientErrorLike<TRouter>>,
	): SWRInfiniteResponse<TQueryValues[TPath]['output'], TError> => {
		const Context = TRPCContext as React.Context<TRPCContextState<TRouter>>

		const { client } = useContext(Context)

		return useSWRInfinite(
			(...keyArguments) => {
				const arguments_ = getKey(...keyArguments)
				if (arguments_ === null) return null

				return [path, ...arguments_]
			},
			// @ts-expect-error normalize args
			(...arguments_) => client.query(...getClientArguments(arguments_, config)),
			config,
		)
	}
}

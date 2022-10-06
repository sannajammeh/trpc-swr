import { TRPCClient, TRPCRequestOptions } from '@trpc/client'
import { AnyProcedure, AnyRouter, inferProcedureInput } from '@trpc/server'

export type CreateClient<TRouter extends AnyRouter> = () => TRPCClient<TRouter>

/**
 * Gets the current key of a procedure call, useful for cache mutation & manual SSR
 * @param input - input of the procedure if any
 * @param {boolean} unserialized - If false (default) the input will be serialized using SWR key serialization, otherwise the key array will be returned.
 */
export type GetKey<TProcedure extends AnyProcedure, TPath extends string> = <
	TInput = inferProcedureInput<TProcedure>,
	RawKey extends boolean | undefined = false,
>(
	input: inferProcedureInput<TProcedure>,
	unserialized?: RawKey,
) => RawKey extends true ? [TPath, TInput] : string

export type GetQueryKey = (
	path: string,
	input: any,
) => readonly [string] | readonly [string, any]

export type WithTRPCOptions<T> = T & {
	trpc: TRPCRequestOptions
}

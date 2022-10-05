import { TRPCClient } from '@trpc/client'
import { AnyRouter, inferHandlerInput, inferProcedureOutput } from '@trpc/server'
import { createContext } from 'react'
import { MutatorOptions } from 'swr'
import { WrapPromiseAndMutatorCallback } from './types'

export interface TRPCContextState<TRouter extends AnyRouter> {
	client: TRPCClient<TRouter>
	mutate<
		TPath extends keyof TRouter['_def']['queries'] & string,
		TProcedure extends TRouter['_def']['queries'][TPath],
		TOutput extends inferProcedureOutput<TProcedure>,
	>(
		pathAndInput: [path: TPath, ...args: inferHandlerInput<TProcedure>],
		data?: WrapPromiseAndMutatorCallback<TOutput>,
		options?: boolean | MutatorOptions<TOutput>,
	): Promise<TOutput | undefined>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TRPCContext = createContext(null as any)

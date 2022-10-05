import { inferProcedureInput, inferProcedureOutput, ProcedureRecord } from '@trpc/server'
import { MutatorCallback } from 'swr'

export type WrapPromiseAndMutatorCallback<TData> = TData | Promise<TData> | MutatorCallback<TData>

export type inferProcedures<
	TObject extends ProcedureRecord<any, any, any, any, any, any>,
> = {
	[TPath in keyof TObject]: {
		input: inferProcedureInput<TObject[TPath]>
		output: inferProcedureOutput<TObject[TPath]>
	}
}

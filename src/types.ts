import { inferProcedureInput, inferProcedureOutput, ProcedureRecord } from '@trpc/server'
import { MutatorCallback } from 'swr'

export type WrapPromiseAndMutatorCallback<TData> = TData | Promise<TData> | MutatorCallback<TData>

export type inferProcedures<
  TObj extends ProcedureRecord<any, any, any, any, any, any>,
> = {
  [TPath in keyof TObj]: {
    input: inferProcedureInput<TObj[TPath]>
    output: inferProcedureOutput<TObj[TPath]>
  }
}

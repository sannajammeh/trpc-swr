import { TRPCClientErrorLike } from '@trpc/client'
import {
	AnyMutationProcedure,
	AnyProcedure,
	AnyQueryProcedure,
	AnyRouter,
	inferProcedureInput,
	inferProcedureOutput,
	ProcedureRouterRecord,
} from '@trpc/server'
import { createRecursiveProxy } from '@trpc/server/shared'
import { SWRConfiguration, SWRResponse } from 'swr'
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation'
import { CreateClient, GetKey } from '../../types'
import { CreateTRPCSWRHooks, getQueryKey, TRPCProvider } from './createSWRHooks'

type DecorateProcedure<
	TProcedure extends AnyProcedure,
	TPath extends string,
> = TProcedure extends AnyQueryProcedure ? {
		useSWR: <TData = inferProcedureOutput<TProcedure>>(
			input: inferProcedureInput<TProcedure>,
			opts?: SWRConfiguration<TData> & {
				isDisabled?: boolean
			},
		) => SWRResponse<TData, TRPCClientErrorLike<TProcedure>>

		preload: (input: inferProcedureInput<TProcedure>) => Promise<void>
		getKey: GetKey<TProcedure, TPath>
	}
	: TProcedure extends AnyMutationProcedure ? {
			useSWRMutation: <
				TData = inferProcedureOutput<TProcedure>,
				TMutationInput = inferProcedureInput<TProcedure>,
				TError = TRPCClientErrorLike<TProcedure>,
			>(
				opts?: SWRMutationConfiguration<TData, TError, TMutationInput, TPath>,
			) => SWRMutationResponse<TData, TError, TMutationInput, TPath>

			getKey: GetKey<TProcedure, TPath>
		} // & (inferProcedureInput<TProcedure> extends { cursor?: any }
	: //   ? {
	//       useInfiniteQuery: <
	//         _TQueryFnData = inferProcedureOutput<TProcedure>,
	//         TData = inferProcedureOutput<TProcedure>
	//       >(
	//         input: Omit<inferProcedureInput<TProcedure>, "cursor">,
	//         opts?: UseTRPCInfiniteQueryOptions<
	//           TPath,
	//           inferProcedureInput<TProcedure>,
	//           TData,
	//           TRPCClientErrorLike<TProcedure>
	//         >
	//       ) => UseInfiniteQueryResult<TData, TRPCClientErrorLike<TProcedure>>;
	//     }
	//   : {})
	//   : TProcedure extends { _type: "mutation" }
	//   ? {
	//       useMutation: <TContext = unknown>(
	//         opts?: UseTRPCMutationOptions<
	//           inferProcedureInput<TProcedure>,
	//           TRPCClientErrorLike<TProcedure>,
	//           inferProcedureOutput<TProcedure>,
	//           TContext
	//         >
	//       ) => UseMutationResult<
	//         inferProcedureOutput<TProcedure>,
	//         TRPCClientErrorLike<TProcedure>,
	//         inferProcedureInput<TProcedure>,
	//         TContext
	//       >;
	//     }
	//   : TProcedure extends { _type: "subscription" }
	//   ? {
	//       useSubscription: (
	//         input: inferProcedureInput<TProcedure>,
	//         opts?: UseTRPCSubscriptionOptions<
	//           inferObservableValue<inferProcedureOutput<TProcedure>>,
	//           TRPCClientErrorLike<TProcedure>
	//         >
	//       ) => void;
	//     }

	never

/**
 * @internal
 */
export type DecoratedProcedureRecord<
	TProcedures extends ProcedureRouterRecord,
	TPath extends string = '',
> = {
	[TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter ? DecoratedProcedureRecord<
			TProcedures[TKey]['_def']['record'],
			`${TPath}${TKey & string}.`
		>
		: TProcedures[TKey] extends AnyProcedure ? DecorateProcedure<TProcedures[TKey], `${TPath}${TKey & string}`>
		: never
}

export type CreateTRPCSWRProxy<TRouter extends AnyRouter> = {
	createClient: CreateClient<TRouter>
	useContext: CreateTRPCSWRHooks<TRouter>['useContext']
	Provider: TRPCProvider<TRouter>
} & DecoratedProcedureRecord<TRouter['_def']['record']>

/**
 * Create proxy for decorating procedures
 * @internal
 */
export function createSWRProxyDecoration<TRouter extends AnyRouter>(
	name: string,
	hooks: CreateTRPCSWRHooks<TRouter>,
) {
	return createRecursiveProxy((opts) => {
		const args = opts.args

		const pathCopy = [name, ...opts.path]

		// The last arg is for instance `.useMutation` or `.useQuery()`
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const lastArg = pathCopy.pop()!

		// The `path` ends up being something like `post.byId`
		const path = pathCopy.join('.')

		if (lastArg === 'useSWRMutation') {
			return (hooks as any)[lastArg](path, ...args)
		}

		const [input, ...rest] = args
		const queryKey = getQueryKey(path, input)

		/**
		 * Preload does not care about other opts.
		 */
		if (lastArg === 'preload') {
			return hooks.preload(queryKey)
		}

		/**
		 * Make sure we error on improper usage
		 */
		if (lastArg === 'getKey') {
			const [unserialized] = rest
			if (typeof unserialized !== 'boolean' && unserialized !== undefined) {
				throw new Error('Expected second argument to be a boolean')
			}
			hooks.getKey(queryKey, unserialized)
		}

		return (hooks as any)[lastArg](queryKey, ...rest)
	})
}

/**
 * TODO - Refactor to createFlatProxy instead
 */
export function createSWRProxyHooksInternal<TRouter extends AnyRouter>(
	hooks: CreateTRPCSWRHooks<TRouter>,
) {
	const proxy: unknown = new Proxy(
		() => {
			// noop
		},
		{
			get(_obj, name) {
				if (name in hooks) {
					return hooks[name as keyof typeof hooks]
				}

				if (typeof name === 'string') {
					return createSWRProxyDecoration(name, hooks)
				}

				throw new Error('Not supported')
			},
		},
	)
	return proxy as CreateTRPCSWRProxy<TRouter>
}

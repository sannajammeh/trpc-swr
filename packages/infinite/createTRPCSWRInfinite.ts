/* eslint-disable unicorn/filename-case */
/* eslint-disable unicorn/prevent-abbreviations */
import { TRPCClientErrorLike } from "@trpc/client";
import {
	AnyProcedure,
	AnyQueryProcedure,
	AnyRouter,
	inferProcedureInput,
	inferProcedureOutput,
	ProcedureRouterRecord,
} from "@trpc/server";
import { createFlatProxy, createRecursiveProxy } from "@trpc/server/shared";
import { SWRConfiguration } from "swr";
import _useSWRInfinite, {
	SWRInfiniteConfiguration,
	SWRInfiniteResponse,
} from "swr/infinite";
import { GetKey, getQueryKey } from "@trpc-swr/client/shared";
import type { CreateTRPCSWRProxy } from "@trpc-swr/client";

type DecorateProcedure<
	TProcedure extends AnyProcedure,
	TPath extends string,
> = TProcedure extends AnyQueryProcedure
	? {
			use: <TData = inferProcedureOutput<TProcedure>>(
				getKey: (
					pageIndex: number,
					previousPageData: TData | null,
				) => inferProcedureInput<TProcedure> | null,
				opts?: SWRConfiguration<TData> & {
					isDisabled?: boolean;
				},
			) => SWRInfiniteResponse<TData, TRPCClientErrorLike<TProcedure>>;
			useCursor: <TData = inferProcedureOutput<TProcedure>>(
				input: inferProcedureInput<TProcedure>,
				getCursor: (previousPageData: TData | null) => any,
				opts?: SWRConfiguration<TData> & {
					isDisabled?: boolean;
				},
			) => SWRInfiniteResponse<TData, TRPCClientErrorLike<TProcedure>>;

			preload: (input: inferProcedureInput<TProcedure>) => Promise<void>;
			getKey: GetKey<TProcedure, TPath>;
	  }
	: never;

/**
 * @internal
 */
export type DecoratedProcedureRecord<
	TProcedures extends ProcedureRouterRecord,
	TPath extends string = "",
> = {
	[TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
		? DecoratedProcedureRecord<
				TProcedures[TKey]["_def"]["record"],
				`${TPath}${TKey & string}.`
		  >
		: TProcedures[TKey] extends AnyProcedure
		? DecorateProcedure<TProcedures[TKey], `${TPath}${TKey & string}`>
		: never;
};

export type CreateTRPCInfiniteProxy<TRouter extends AnyRouter> =
	DecoratedProcedureRecord<TRouter["_def"]["record"]>;

function createInfiniteProxyDecoration(
	name: string,
	hooks: CreateSWRInfiniteHooks,
) {
	return createRecursiveProxy((opts) => {
		const args = opts.args;
		const pathCopy = [name, ...opts.path];

		// The last arg is for instance `.use` or `.useCursor()`
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		const lastArg = pathCopy.pop()!;
		const path = pathCopy.join(".");

		if (lastArg === "useCursor") {
			const [input, ...rest] = args;
			const queryKey = getQueryKey(path, input);
			return hooks.useCursor(queryKey, ...rest);
		}

		const [geyKeyCallback, ...rest] = args;

		return hooks[lastArg as keyof CreateSWRInfiniteHooks](
			path,
			geyKeyCallback,
			...rest,
		);
	});
}

export function createSWRInfiniteHooks<TRouter extends AnyRouter>(
	trpc: CreateTRPCSWRProxy<TRouter>,
): CreateSWRInfiniteHooks {
	const useSWRInfinite = (
		path: string,
		getKey: (cursor: number, previousPageData: any) => any,
		config?: SWRInfiniteConfiguration & {
			isDisabled?: boolean;
		},
	) => {
		const { nativeClient: client } = trpc.useContext();

		return _useSWRInfinite(
			(index, previousPageData) => {
				if (config?.isDisabled) return null;
				return getKey(index, previousPageData);
			},
			(args) => {
				return client.query(path, args);
			},
			config,
		);
	};

	/**
	 * Uses a preset cursor to fetch the next page. Cursor MUST exist on the input object
	 */
	const useCursor = (
		pathAndInput: [string, any],
		getCursor: (data: any) => any,
		config?: SWRInfiniteConfiguration & {
			isDisabled?: boolean;
		},
	) => {
		const { nativeClient: client } = trpc.useContext();

		return _useSWRInfinite(
			(index, previousPageData) => {
				if (config?.isDisabled) return null; // Disable
				const [path, input] = pathAndInput;
				// First page
				if (index === 0) return pathAndInput;

				// Input must be an object
				if (typeof input !== "object" && typeof input !== "undefined") {
					console.warn(
						`Input should be an object, got ${typeof input}. Use \`infinite.<endpoint>.use\` instead to build your own custom pagination.`,
					);
				}

				// Use dummy input object if none exists
				const inputSpread = typeof input === "object" ? { ...input } : {};
				const cursor = getCursor(previousPageData);

				// Reached the end
				if (
					previousPageData &&
					(typeof cursor === "undefined" || cursor === null)
				) {
					return null;
				}

				return [
					path,
					{
						...inputSpread,
						cursor,
					},
				];
			},
			(args) => {
				const [path, input] = args;
				return client.query(path, input);
			},
			config,
		);
	};

	return { use: useSWRInfinite, useCursor };
}

interface CreateSWRInfiniteHooks {
	use: any;
	useCursor: any;
}

export function createInfiniteProxyInternal<TRouter extends AnyRouter>(
	hooks: CreateSWRInfiniteHooks,
): CreateTRPCInfiniteProxy<TRouter> {
	return createFlatProxy<CreateTRPCInfiniteProxy<TRouter>>((key) => {
		if (key in hooks) {
			return hooks[key as keyof typeof hooks];
		}
		return createInfiniteProxyDecoration(key, hooks);
	});
}

export function createSWRInfiniteProxy<TRouter extends AnyRouter>(
	trpc: CreateTRPCSWRProxy<TRouter>,
): CreateTRPCInfiniteProxy<TRouter> {
	const hooks = createSWRInfiniteHooks(trpc);
	return createInfiniteProxyInternal(hooks) as CreateTRPCInfiniteProxy<TRouter>;
}

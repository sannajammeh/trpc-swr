import {
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  ClientDataTransformerOptions,
  inferProcedureInput,
  inferProcedureOutput,
  inferRouterContext,
  ProcedureRouterRecord,
} from "@trpc/server";
import { createFlatProxy, createRecursiveProxy } from "@trpc/server/shared";

import type { GetKey, GetQueryKey } from "@trpc-swr/client/shared";
import { unstable_serialize } from "./serialize";

/**
 * Describes the options for the `<endpoint>.fetch` method.
 */
type FetchOptions = {
  /**
   * If `true` the returned promise will be transformed by the `transformer` from the router.
   * Note: It will always be transformed during `.dehydrate()` calls
   * @default false
   */
  transform?: boolean;
};

type CallableProcedure<TProcedure extends AnyProcedure> = (
  input: inferProcedureInput<TProcedure>,
  opts?: FetchOptions
) => Promise<inferProcedureOutput<TProcedure>>;

type DecorateProcedure<
  TProcedure extends AnyProcedure,
  TPath extends string,
> = TProcedure extends AnyQueryProcedure
  ? {
      getKey: GetKey<TProcedure, TPath>;
    } & CallableProcedure<TProcedure>
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

export type ProxySSGHelpers<TRouter extends AnyRouter> = {
  dehydrate: () => Promise<Record<string, any>>;
} & DecoratedProcedureRecord<TRouter["_def"]["record"]>;

type Caller = ReturnType<AnyRouter["createCaller"]>;

function createSSRProxyDecoration(
  name: string,
  state: Map<string, any>,
  caller: Caller,
  serialize: (obj: unknown) => unknown = (obj) => obj,
  defaultTransform: boolean = false
) {
  return createRecursiveProxy((opts) => {
    const args = opts.args;
    const pathCopy = [name, ...opts.path];

    const lastArg = pathCopy.at(-1);

    if (lastArg === "getKey") {
      // Here we have one extra argument in the path, so remove it.
      pathCopy.pop();
      const path = pathCopy.join(".");
      const [input] = args;
      const queryKey = getQueryKey(path, input);
      return getKey(queryKey);
    }

    const path = pathCopy.join(".");

    const [input, opt] = args;
    const queryKey = getQueryKey(path, input);

    const serializedKey = getKey(queryKey);

    // No utilities called, return the caller wrapped in serializer state
    const paths = [...pathCopy];
    //@ts-expect-error Can't narrow on an unknown path
    const callerTarget = paths.reduce<Caller>((acc, path) => acc[path], caller);

    if (typeof callerTarget === "function") {
      // @ts-expect-error Poor TS support for recursive types
      const promise = callerTarget(input);
      state.set(serializedKey, promise);
      return promise.then((v: any) => {
        const shouldTransform =
          (opt as FetchOptions)?.transform ?? defaultTransform;
        return shouldTransform ? serialize(v) : v;
      });
    }

    throw new Error(`trpc-swr: Nothing to call at ${path}`);
  });
}

// Get key
const getKey = <PreloadData extends ReturnType<GetQueryKey>>(
  pathAndInput: PreloadData
) => {
  return unstable_serialize(pathAndInput);
};

const getQueryKey: GetQueryKey = (path: string, input: any) => {
  return typeof input === "undefined"
    ? ([path] as const)
    : ([path, input] as const);
};

export interface ProxySSGHelpersConfig<TRouter extends AnyRouter> {
  router: TRouter;
  ctx: inferRouterContext<TRouter>;
}

export function createSSRHelpers<TRouter extends AnyRouter>({
  router,
  ctx = {},
}: ProxySSGHelpersConfig<TRouter>) {
  const state = new Map<string, any>();

  // Auto infer transformer from router
  const transformer: undefined | ClientDataTransformerOptions =
    router._def._config.transformer;

  const caller = router.createCaller(ctx);

  // Build serialize function from transformer
  const serialize = transformer
    ? ("input" in transformer ? transformer.input : transformer).serialize
    : (obj: unknown) => obj;

  return createFlatProxy<ProxySSGHelpers<TRouter>>((key) => {
    if (key === "dehydrate") {
      return async () => {
        const asyncEntries = await Promise.all(
          Array.from(state.entries()).map(async ([key, value]) => {
            return [key, serialize(await value)];
          })
        );

        return Object.fromEntries(asyncEntries);
      };
    }

    return createSSRProxyDecoration(key, state, caller, serialize);
  });
}

/**
 * @deprecated Use `createSSRHelpers` instead
 */
export const createProxySSGHelpers = createSSRHelpers;

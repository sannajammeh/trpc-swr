import {
  createTRPCClient,
  CreateTRPCClientOptions,
  createTRPCProxyClient,
  TRPCClient,
  TRPCClientErrorLike,
} from "@trpc/client";
import {
  AnyProcedure,
  AnyRouter,
  ClientDataTransformerOptions,
  inferProcedureInput,
  inferProcedureOutput,
  ProcedureRouterRecord,
} from "@trpc/server";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import _useSWR, {
  preload as _preload,
  SWRConfig as _SWRConfig,
  SWRConfiguration,
  SWRResponse,
  unstable_serialize,
} from "swr";
import { TRPCContext, TRPCContextType } from "./context";

import _useSWRMutation, {
  SWRMutationConfiguration,
  SWRMutationResponse,
} from "swr/mutation";
import { CreateClient, GetQueryKey } from "./types";
import { useTransformFallback } from "./useTransformedFallback";

/**
 * @internal - use this to create custom hooks
 * @deprecated - use `createSWRProxyHooks` instead
 */
export function createSWRHooks<TRouter extends AnyRouter>(
  config: CreateTRPCClientOptions<TRouter>
): CreateTRPCSWRHooks<TRouter> {
  // TODO - Infer types of useSWR

  const createClient: CreateClient<TRouter> = (
    configOverride?: CreateTRPCClientOptions<TRouter>
  ) => {
    return createTRPCClient(configOverride || config);
  };

  const Context = TRPCContext as unknown as React.Context<
    TRPCContextType<TRouter>
  >;

  const useTRPCContext = () => useContext(Context);

  const useSWR = (
    pathAndInput: [string, any],
    config?: SWRConfiguration & {
      isDisabled?: boolean;
    }
  ) => {
    const { nativeClient } = useTRPCContext();
    const { isDisabled, ...swrConfig } = config || {};
    return _useSWR(
      isDisabled ? null : pathAndInput,
      (pathAndInput: ReturnType<GetQueryKey>) => {
        return (nativeClient as any).query(...pathAndInput);
      },
      swrConfig
    );
  };

  const useSWRMutation = (
    path: string,
    config: SWRMutationConfiguration<any, any>
  ) => {
    const { nativeClient } = useTRPCContext();
    return _useSWRMutation(
      path,
      (path: any, { arg }: any) => {
        return nativeClient.mutation(path, arg);
      },
      config
    );
  };

  let _clientRef: TRPCClient<TRouter> | null = null;

  const TRPCProvider = ({
    children,
    client,
  }: PropsWithChildren<{ client: TRPCClient<TRouter> }>) => {
    useEffect(() => {
      _clientRef = client;
    }, [client]);

    const [vanillaClient] = useState(() => {
      return createTRPCProxyClient<TRouter>(config);
    });
    return (
      <Context.Provider
        value={{
          nativeClient: client,
          client: vanillaClient,
        }}
      >
        {children}
      </Context.Provider>
    );
  };

  const preload = <PreloadData extends ReturnType<GetQueryKey>>(
    pathAndInput: PreloadData
  ) => {
    /**
     * SWR ??? - why is this not default?
     */
    if (typeof window === "undefined") {
      return Promise.resolve();
    }

    return _preload(pathAndInput, (pathAndInput: PreloadData) => {
      // Create client instance if not already created (Will be Garbage collected once TRPCProvider mounts)
      if (!_clientRef) {
        _clientRef = createClient();
      }
      return (_clientRef as any).query(...pathAndInput);
    });
  };

  const getKey = <PreloadData extends ReturnType<GetQueryKey>>(
    pathAndInput: PreloadData,
    unserialized = false
  ) => {
    return unserialized ? pathAndInput : unstable_serialize(pathAndInput);
  };

  const SWRConfig: React.FC<React.ComponentProps<typeof _SWRConfig>> = ({
    children,
    value,
  }) => {
    const fallback = (value as any)?.fallback;
    const transformedFallback = useTransformFallback(
      fallback,
      config?.transformer as any
    );

    const finalValue = {
      ...value,
    };
    if (transformedFallback) {
      (finalValue as any).fallback = transformedFallback;
    }
    return <_SWRConfig value={finalValue}>{children}</_SWRConfig>;
  };

  return {
    Provider: TRPCProvider,
    useContext: useTRPCContext,
    SWRConfig: SWRConfig,
    useSWR,
    useSWRMutation,
    preload: preload,
    getKey: getKey,
    createClient,
  } as any;
}

export type TRPCProvider<TRouter extends AnyRouter> = React.FC<
  React.PropsWithChildren<{
    client: TRPCClient<TRouter>;
  }>
>;

export type UseSWR<_ extends ProcedureRouterRecord> = <
  TPath extends string,
  TProcedure extends AnyProcedure
>(
  pathAndInput: [TPath, inferProcedureInput<TProcedure>],
  config?: SWRConfiguration & {
    isDisabled?: boolean;
  }
) => SWRResponse<
  inferProcedureOutput<TProcedure>,
  TRPCClientErrorLike<TProcedure>
>;

export type UseSWRMutation<_ extends ProcedureRouterRecord> = <
  TPath extends string,
  TProcedure extends AnyProcedure,
  TInput = inferProcedureInput<TProcedure>,
  TOutput = inferProcedureOutput<TProcedure>
>(
  path: TPath,
  config: SWRMutationConfiguration<TInput, TOutput>
) => SWRMutationResponse<
  TOutput,
  TRPCClientErrorLike<TProcedure>,
  TPath,
  TInput
>;

export interface CreateTRPCSWRHooks<
  TRouter extends AnyRouter,
  TProcedures extends ProcedureRouterRecord = TRouter["_def"]["record"]
> {
  Provider: TRPCProvider<TRouter>;
  SWRConfig: React.FC<
    React.ComponentProps<typeof _SWRConfig> & {
      transformer?: ClientDataTransformerOptions;
    }
  >;
  useContext: () => TRPCContextType<TRouter>;
  useSWR: UseSWR<TProcedures>;
  useSWRMutation: UseSWRMutation<TProcedures>;
  getKey: <PreloadData extends readonly [string] | readonly [string, any]>(
    pathAndInput: PreloadData,
    unserialized?: boolean
  ) => string | PreloadData;
  preload: (pathAndInput: ReturnType<GetQueryKey>) => Promise<void>;
  createClient: CreateClient<TRouter>;
}

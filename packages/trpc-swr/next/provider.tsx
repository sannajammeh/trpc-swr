import { CreateTRPCClientOptions } from "@trpc/client";
import type { AnyRouter, ClientDataTransformerOptions } from "@trpc/server";
import React, { memo, useState } from "react";
import { SWRConfig } from "swr";
import { CreateTRPCSWRProxy } from "trpc-swr";
import { useTransformFallback } from "trpc-swr/_internal";

interface SWRProviderProps {
	children: React.ReactNode;
	fallback?: Record<any, any>;
}

const _SWRProvider = ({ children, fallback = {} }: SWRProviderProps) => {
	return (
		<SWRConfig
			value={{
				fallback,
			}}
		>
			{children}
		</SWRConfig>
	);
};

export const SWRProvider = memo(_SWRProvider);

type Config = {
	transformer?: ClientDataTransformerOptions;
};

export const withTRPCSWR =
	({ transformer }: Config = {}) =>
	<T extends Record<any, any>>(Component: React.ComponentType<any>) => {
		return (props: T) => {
			const { pageProps } = props;
			const { swr } = pageProps || {};
			const transformedFallback = useTransformFallback(swr, transformer);

			return (
				<SWRProvider fallback={transformedFallback}>
					<Component {...props} />
				</SWRProvider>
			);
		};
	};

export const withTRPCNext =
	<TRouter extends AnyRouter>(
		config: CreateTRPCClientOptions<TRouter>,
		hooks: CreateTRPCSWRProxy<TRouter>,
	) =>
	<T extends Record<any, any>>(Component: React.ComponentType<any>) => {
		return (props: T) => {
			const { pageProps } = props;
			const { swr } = pageProps || {};
			const transformedFallback = useTransformFallback(
				swr,
				config.transformer as any,
			);

			const [client] = useState(() => hooks.createClient());

			return (
				<SWRProvider fallback={transformedFallback}>
					<hooks.Provider client={client}>
						<Component {...props} />
					</hooks.Provider>
				</SWRProvider>
			);
		};
	};

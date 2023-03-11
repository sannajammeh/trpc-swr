/* eslint-disable unicorn/filename-case */
import { CreateTRPCClientOptions } from "@trpc/client";
import { AnyRouter } from "@trpc/server";
import { createSWRHooks } from "trpc-swr/_internal";
import {
	createSWRProxyHooksInternal,
	CreateTRPCSWRProxy,
} from "./createSWRProxyHooks";

export function createSWRProxyHooks<TRouter extends AnyRouter>(
	config: CreateTRPCClientOptions<TRouter>,
): CreateTRPCSWRProxy<TRouter> {
	const hooks = createSWRHooks(config);

	const proxy = createSWRProxyHooksInternal(hooks);

	return proxy;
}

/* eslint-disable unicorn/filename-case */
import { CreateTRPCClientOptions } from "@trpc/client";
import { AnyRouter } from "@trpc/server";

import {
	createSWRProxyHooksInternal,
	CreateTRPCSWRProxy,
} from "./createSWRProxyHooks";
import { createSWRHooks } from "./shared/createSWRHooks";

export function createSWRProxyHooks<TRouter extends AnyRouter>(
	config: CreateTRPCClientOptions<TRouter>,
): CreateTRPCSWRProxy<TRouter> {
	const hooks = createSWRHooks(config);

	const proxy = createSWRProxyHooksInternal(hooks);

	return proxy as unknown as CreateTRPCSWRProxy<TRouter>;
}

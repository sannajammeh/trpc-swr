import { CreateTRPCProxyClient, TRPCClient } from "@trpc/client";
import { AnyRouter } from "@trpc/server";
import { createContext, useContext } from "react";

export interface TRPCContextType<TRouter extends AnyRouter> {
	nativeClient: TRPCClient<TRouter>;
	client: CreateTRPCProxyClient<TRouter>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// rome-ignore lint/style/noNonNullAssertion: <explanation>
export const TRPCContext = createContext(null!);

export const useTRPCSWRContext = () => useContext(TRPCContext);

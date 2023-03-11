// @vitest-environment node

import { inferAsyncReturnType } from "@trpc/server";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { IncomingMessage, ServerResponse } from "node:http";
import { appRouter } from "./router";

const createContext = ({
	req,
	res,
}: NodeHTTPCreateContextFnOptions<
	IncomingMessage,
	ServerResponse<IncomingMessage>
>) => {
	return {
		req,
		res,
	};
};

export type Context = inferAsyncReturnType<typeof createContext>;

export const getServer = () =>
	createHTTPServer({
		router: appRouter,
		createContext: createContext,
	});

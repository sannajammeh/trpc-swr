import { GetQueryKey } from "./types";

/**
 * Creates a query key for use inside SWR (unserialized)
 * @internal - Used internally to create a query key
 */
export const getQueryKey: GetQueryKey = (path: string, input: any) => {
	return typeof input === "undefined"
		? ([path] as const)
		: ([path, input] as const);
};

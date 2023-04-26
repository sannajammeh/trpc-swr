import { appRouter } from "@/server/_app";
import { createNextApiHandler } from "@trpc/server/adapters/next";

export default createNextApiHandler({
	router: appRouter,
	createContext: ({ req, res }) => ({ req, res }),
});

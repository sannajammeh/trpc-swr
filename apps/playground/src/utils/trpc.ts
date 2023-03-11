import { httpBatchLink, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";
import { createTRPCSWRNext } from "trpc-swr/next";
import { createSWRInfiniteProxy } from "trpc-swr/infinite";
import type { AppRouter } from "../server/router";

const getUrl = () => {
  if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000/api/trpc";
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api/trpc`;
    }
    return "https://localhost:3000/api/trpc";
  }

  return "/api/trpc";
};

export const trpc = createTRPCSWRNext<AppRouter>({
  links: [
    loggerLink({
      enabled() {
        return process.env.NODE_ENV === "development";
      },
    }),
    httpBatchLink({
      url: getUrl(),
    }),
  ],
  transformer: SuperJSON,
});

export const infinite = createSWRInfiniteProxy(trpc);

import { createProxySSGHelpers } from "trpc-swr/ssg";
import { appRouter } from "./router";

export const createSSG = () => {
  return createProxySSGHelpers({
    router: appRouter,
    ctx: {},
  });
};

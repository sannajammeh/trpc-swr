import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/router";

export default createNextApiHandler({
  router: appRouter,

  createContext: () => {
    // put your context here
    return {};
  },
});

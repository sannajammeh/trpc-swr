# @trpc-swr/ssr

[tRPC](https://trpc.io/)-ified [SWR](https://swr.vercel.app/) hooks

Framework agnostic SSR for trpc-swr.

Documentation: https://trpc-swr.vercel.app/server-side/next-13-appdir

## Usage

Define a helper function to create a new `trpc` ssr instance for each request.

In `server/ssr.ts`

```tsx
import { createProxySSGHelpers } from "@trpc-swr/ssr";
import { appRouter } from "server/appRouter";

export const createSSR = () => {
  return createProxySSGHelpers({
    router: appRouter,
    ctx: {},
  });
};
```

In a page

```tsx
import { createSSR } from "<trpc-ssr-location>";

const getData = () => {
  const rsc = createSSR();

  return rsc.home.getVersion.fetch();
};

export default async function HomePage() {
  const version = await getData();

  return <div>{version}</div>;
}
```

---
"@trpc-swr/infinite": major
"@trpc-swr/client": major
"@trpc-swr/next": major
"@trpc-swr/ssr": major
---

## What:

`@trpc-swr/ssr` - `createProxySSGHelpers` renamed to `createSSRHelpers`

`@trpc-swr/ssr` - Calling `api.endpoint.fetch` is no longer support, use api.endpoint() directly. trpc-swr will now proxy all arguments directly into appRouter.createCaller() instead of calling `caller.query`.
This allows for both mutations and queries to endpoints in React Server Components and other SSR calls

#### Before

```tsx
const data = await rsc.users.byId.fetch({ id: 1 });

const swrFallback = await rsc.dehydrate();
```

#### After

```tsx
const data = await rsc.users.byId({ id: 1 });

// Other supported methods:
const key = rsc.users.byId.getKey(); // Use to manually forward to SWRConfig.
const swrFallback = await rsc.dehydrate();
```

As always both direct access and dehydration into SWR serializable fallback is supported.

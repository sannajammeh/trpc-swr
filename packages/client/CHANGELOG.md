# @trpc-swr/client

## 3.0.0-canary.0

### Major Changes

- [#54](https://github.com/sannajammeh/trpc-swr/pull/54) [`5b020a2`](https://github.com/sannajammeh/trpc-swr/commit/5b020a2a9d01e86d125eee33192f025ce7e35462) Thanks [@sannajammeh](https://github.com/sannajammeh)! - ## What:

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

## 2.0.1

### Patch Changes

- [`2fcbcef`](https://github.com/sannajammeh/trpc-swr/commit/2fcbcef7c17a9cb526b6cf3f1bf6346781ad58c3) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Fixes SWRConfigation options type being empty object, adds a Typescript test case to ensure options type is correct.

- [`#51`](https://github.com/sannajammeh/trpc-swr/pull/51) Thanks [@group900-3](https://github.com/group900-3)! - Fix Infinite types

## 2.0.0

### Minor Changes

- [`413ca6d`](https://github.com/sannajammeh/trpc-swr/commit/413ca6d7e9347c5ebb2f23e15caf2f779a9d7128) Thanks [@sskmy1024y](https://github.com/sskmy1024y)! - Enable support for correct suspense type inference

## 1.0.2

### Patch Changes

- [`f066444`](https://github.com/sannajammeh/trpc-swr/commit/f066444f86d679e8e64ea5f814471118f6c01167) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Reorders the typescript generic arguments passed to `useSWRMutation` on latest SWR version `2.2.0` to ensure input of `trigger` fn is correct.

## 1.0.1

### Patch Changes

- [#43](https://github.com/sannajammeh/trpc-swr/pull/43) [`3874d98`](https://github.com/sannajammeh/trpc-swr/commit/3874d98e23f31453832ba0b474712885f9f8266a) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Adds README.md files and package.json link entries for all packages

## 1.0.0

### Major Changes

- [#40](https://github.com/sannajammeh/trpc-swr/pull/40) [`1a9b77c`](https://github.com/sannajammeh/trpc-swr/commit/1a9b77c673cd45bd8a77a4f7e64f879238d78b76) Thanks [@sannajammeh](https://github.com/sannajammeh)! - # 🚀 trpc-swr release candidate 🚀

  ### [BREAKING]: Moves all packages to the new package structure:

  `trpc-swr` -> `@trpc-swr/client`
  `trpc-swr/infinite` -> `@trpc-swr/infinite`
  `trpc-swr/next` -> `@trpc-swr/next`
  `trpc-swr/ssr` -> `@trpc-swr/ssr`

  ### Fixes

  - Full interop with tRPC v10 proxy api
  - Aligs all packages to the same version
  - Adds necessary SSR support using `@trpc-swr/ssr` and `@trpc-swr/next`
  - Adds infinite query support using `@trpc-swr/infinite`

  ### Improvements

  - Adds e2e tests for all packages
  - Adds unit tests for all packages

### Patch Changes

- [#40](https://github.com/sannajammeh/trpc-swr/pull/40) [`666b3b3`](https://github.com/sannajammeh/trpc-swr/commit/666b3b3151aa5453ab03d9c11c7c14b1e4bd372e) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Removes @trpc-swr/internal in favor of exports sugar pointing to "@trpc-swr/client/shared", this isan internal dependency so no breaking change

- [#40](https://github.com/sannajammeh/trpc-swr/pull/40) [`57aa58f`](https://github.com/sannajammeh/trpc-swr/commit/57aa58f90363f3c48de6936b20338b8c36a2a2e4) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Add "shared" folder to @trpc-swr/client

## 1.0.0-rc.2

### Patch Changes

- [#40](https://github.com/sannajammeh/trpc-swr/pull/40) [`57aa58f`](https://github.com/sannajammeh/trpc-swr/commit/57aa58f90363f3c48de6936b20338b8c36a2a2e4) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Add "shared" folder to @trpc-swr/client

## 1.0.0-rc.1

### Patch Changes

- Removes @trpc-swr/internal in favor of exports sugar pointing to "@trpc-swr/client/shared", this isan internal dependency so no breaking change

## 1.0.0-rc.0

### Major Changes

- [#40](https://github.com/sannajammeh/trpc-swr/pull/40) [`1a9b77c`](https://github.com/sannajammeh/trpc-swr/commit/1a9b77c673cd45bd8a77a4f7e64f879238d78b76) Thanks [@sannajammeh](https://github.com/sannajammeh)! - # 🚀 trpc-swr release candidate 🚀

  ### [BREAKING]: Moves all packages to the new package structure:

  `trpc-swr` -> `@trpc-swr/client`
  `trpc-swr/infinite` -> `@trpc-swr/infinite`
  `trpc-swr/next` -> `@trpc-swr/next`
  `trpc-swr/ssr` -> `@trpc-swr/ssr`

  ### Fixes

  - Full interop with tRPC v10 proxy api
  - Aligs all packages to the same version
  - Adds necessary SSR support using `@trpc-swr/ssr` and `@trpc-swr/next`
  - Adds infinite query support using `@trpc-swr/infinite`

  ### Improvements

  - Adds e2e tests for all packages
  - Adds unit tests for all packages

### Patch Changes

- Updated dependencies [[`1a9b77c`](https://github.com/sannajammeh/trpc-swr/commit/1a9b77c673cd45bd8a77a4f7e64f879238d78b76)]:
  - @trpc-swr/internal@1.0.0-rc.0

# @trpc-swr/ssr

## 3.0.0-canary.1

### Patch Changes

- [`4d101c7`](https://github.com/sannajammeh/trpc-swr/commit/4d101c72c0bd2aa50f8a54621818099a684bdcaf) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Ensure trpc-swr/ssr caller can execute on mutations

- Updated dependencies []:
  - @trpc-swr/client@3.0.0-canary.1

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

### Patch Changes

- Updated dependencies [[`5b020a2`](https://github.com/sannajammeh/trpc-swr/commit/5b020a2a9d01e86d125eee33192f025ce7e35462)]:
  - @trpc-swr/client@3.0.0-canary.0

## 2.0.1

### Patch Changes

- Updated dependencies [[`2fcbcef`](https://github.com/sannajammeh/trpc-swr/commit/2fcbcef7c17a9cb526b6cf3f1bf6346781ad58c3), [`08e5def`](https://github.com/sannajammeh/trpc-swr/commit/08e5def0fee01714f4a8dbc3c7a28b2d76153ef7)]:
  - @trpc-swr/client@2.0.1

## 2.0.0

### Patch Changes

- Updated dependencies [[`413ca6d`](https://github.com/sannajammeh/trpc-swr/commit/413ca6d7e9347c5ebb2f23e15caf2f779a9d7128)]:
  - @trpc-swr/client@2.0.0

## 1.0.2

### Patch Changes

- [`f066444`](https://github.com/sannajammeh/trpc-swr/commit/f066444f86d679e8e64ea5f814471118f6c01167) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Reorders the typescript generic arguments passed to `useSWRMutation` on latest SWR version `2.2.0` to ensure input of `trigger` fn is correct.

- Updated dependencies [[`f066444`](https://github.com/sannajammeh/trpc-swr/commit/f066444f86d679e8e64ea5f814471118f6c01167)]:
  - @trpc-swr/client@1.0.2

## 1.0.1

### Patch Changes

- [#43](https://github.com/sannajammeh/trpc-swr/pull/43) [`3874d98`](https://github.com/sannajammeh/trpc-swr/commit/3874d98e23f31453832ba0b474712885f9f8266a) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Adds README.md files and package.json link entries for all packages

- Updated dependencies [[`3874d98`](https://github.com/sannajammeh/trpc-swr/commit/3874d98e23f31453832ba0b474712885f9f8266a)]:
  - @trpc-swr/client@1.0.1

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

- Updated dependencies [[`666b3b3`](https://github.com/sannajammeh/trpc-swr/commit/666b3b3151aa5453ab03d9c11c7c14b1e4bd372e), [`1a9b77c`](https://github.com/sannajammeh/trpc-swr/commit/1a9b77c673cd45bd8a77a4f7e64f879238d78b76), [`57aa58f`](https://github.com/sannajammeh/trpc-swr/commit/57aa58f90363f3c48de6936b20338b8c36a2a2e4)]:
  - @trpc-swr/client@1.0.0

## 1.0.0-rc.2

### Patch Changes

- [#40](https://github.com/sannajammeh/trpc-swr/pull/40) [`57aa58f`](https://github.com/sannajammeh/trpc-swr/commit/57aa58f90363f3c48de6936b20338b8c36a2a2e4) Thanks [@sannajammeh](https://github.com/sannajammeh)! - Add "shared" folder to @trpc-swr/client

- Updated dependencies [[`57aa58f`](https://github.com/sannajammeh/trpc-swr/commit/57aa58f90363f3c48de6936b20338b8c36a2a2e4)]:
  - @trpc-swr/client@1.0.0-rc.2

## 1.0.0-rc.1

### Patch Changes

- Removes @trpc-swr/internal in favor of exports sugar pointing to "@trpc-swr/client/shared", this isan internal dependency so no breaking change

- Updated dependencies []:
  - @trpc-swr/client@1.0.0-rc.1

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

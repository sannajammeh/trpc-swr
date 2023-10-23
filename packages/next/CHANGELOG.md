# @trpc-swr/next

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
  - @trpc-swr/client@1.0.0-rc.0

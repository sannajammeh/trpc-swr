# config

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
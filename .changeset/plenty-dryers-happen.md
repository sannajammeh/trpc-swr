---
"@trpc-swr/infinite": major
"@trpc-swr/client": major
"config": major
"@trpc-swr/next": major
"@trpc-swr/ssr": major
---

# 🚀 trpc-swr release candidate 🚀

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

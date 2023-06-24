---
"@trpc-swr/client": patch
"@trpc-swr/infinite": patch
"@trpc-swr/next": patch
"@trpc-swr/ssr": patch
---

Reorders the typescript generic arguments passed to `useSWRMutation` on latest SWR version `2.2.0` to ensure input of `trigger` fn is correct.

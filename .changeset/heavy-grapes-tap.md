---
"@trpc-swr/infinite": patch
"@trpc-swr/client": patch
"config": patch
"@trpc-swr/next": patch
"@trpc-swr/ssr": patch
---

Removes @trpc-swr/internal in favor of exports sugar pointing to "@trpc-swr/client/shared", this isan internal dependency so no breaking change

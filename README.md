# trpc-swr

[tRPC](https://trpc.io/)-ified [SWR](https://swr.vercel.app/) hooks

## Installation

```sh
npm install trpc-swr @trpc/client
```

## Usage

First, create your fully typed hooks using your router type:

```ts
// trpc.ts
import { createSWRHooks } from 'trpc-swr'
// `import type` ensures this import is fully erased at runtime
import type { AppRouter } from './router'

export const trpc = createSWRHooks<AppRouter>()
```

Then, add the `trpc.TRPCProvider` to your root `App` component:

```ts
// _app.tsx
import { createTRPCClient } from '@trpc/client'
import { trpc } from '../utils/trpc'

const App = () => {
  // create a tRPC vanilla client
  // see https://trpc.io/docs/vanilla
  // note that you should pass data transformers (https://trpc.io/docs/data-transformers) here
  const [client] = useState(() =>
    createTRPCClient({ url: 'http://localhost:3000/api/trpc' })
  )

  return (
    <trpc.TRPCProvider client={client}>
      <Component {...pageProps} />
    </trpc.TRPCProvider>
  )
}
```

> Tip: For [SWR's global configuration](https://swr.vercel.app/docs/global-configuration), wrap this provider with `SWRConfig`.

### useSWR

Now use `trpc` to query in a component:

```ts
// profile.tsx
import { trpc } from './trpc'

const Profile = (props: { userId: string }) => {
  const { data, isValidating } = trpc.useSWR(['user.get', { id: props.userId }])

  return (
    <div>
      Name: {!data && isValidating
        ? 'loading...'
        : data
        ? data.name
        : 'User does not exist'}
    </div>
  )
}
```

`trpc.useSWR` functions the same and accepts all the options that SWR's [`useSWR`](https://swr.vercel.app/docs/options#options) hook does. It is only a very small wrapper that adds tRPC types and creates a fetcher using tRPC's vanilla client.

### Mutations

You can use `trpc.useContext` to get a tRPC client for mutations:

```ts
// profile.tsx
import { trpc } from './trpc'

const Profile = (props: { userId: string }) => {
  // get `mutate` from trpc.useSWR
  // this is a bound mutate (https://swr.vercel.app/docs/mutation#bound-mutate)
  const { data, mutate, isValidating } = trpc.useSWR(['user.get', {
    id: props.userId,
  }])
  const { client } = trpc.useContext()

  return (
    <div>
      <div>
        Name: {!data && isValidating
          ? 'loading...'
          : data
          ? data.name
          : 'User does not exist'}
      </div>

      <button
        onClick={() => {
          // you would typically get this from user input
          // but it is hardcoded here to simplify the example
          const newName = 'Jack'

          // `mutate` revalidates the `user.get` key above
          // so it is refetched after the mutation is complete
          mutate(
            () => {
              return client.mutation('user.changeName', {
                id: props.userId,
                newName,
              })
            }, // use optimisticData to show new name before mutation completes
            { optimisticData: { name: newName } },
          )
        }}
      >
      </button>
    </div>
  )
}
```

You can also use `trpc.useContext` to get a `mutate` function which is the same as [SWR's global mutate](https://swr.vercel.app/docs/mutation). However, you will have the pass the same key, meaning the query path and input that you passed to `useSWR`. Here it is with the same example as above:

```ts
// profile.tsx
import { trpc } from './trpc'

const Profile = (props: { userId: string }) => {
  const { data, isValidating } = trpc.useSWR(['user.get', {
    id: props.userId,
  }])

  // get `mutate` from `trpc.useContext`
  const { client, mutate } = trpc.useContext()

  return (
    <div>
      <div>
        Name: {!data && isValidating
          ? 'loading...'
          : data
          ? data.name
          : 'User does not exist'}
      </div>

      <button
        onClick={() => {
          const newName = 'Jack'

          mutate(
            // must pass in exact same query path and input
            // to revalidate the query key
            // note that you can use `matchMutate` to
            // revalidate query keys with the same path
            ['user.get', { id: props.userId }],
            () => {
              return client.mutation('user.changeName', {
                id: props.userId,
                newName,
              })
            },
            { optimisticData: { name: newName } },
          )
        }}
      >
      </button>
    </div>
  )
}
```

### useSWRInfinite

`trpc-swr` also provides a [`useSWRInfinite`](https://swr.vercel.app/docs/pagination#useswrinfinite) wrapper. Create your typed `useSWRInfinite`:

```ts
// trpc.ts
import { createSWRHooks } from 'trpc-swr'
import { getUseSWRInfinite } from 'trpc-swr/infinite'

// `import type` ensures this import is fully erased at runtime
import type { AppRouter } from './router'

export const trpc = createSWRHooks<AppRouter>()
export const useSWRInfinite = getUseSWRInfinite<AppRouter>()
```

> This requires using `getUseSWRInfinite` and passing in the `AppRouter` type again, so we can take full advantage of tree shaking and remove the functions that your app does not use.

Now use it in a component:

```ts
// users.tsx
import { useSWRInfinite } from './trpc'

const Users = () => {
  const { data, size, setSize } = useSWRInfinite(
    // pass in path
    'user.get',
    (index, previousPageData) => {
      if (index !== 0 && !previousPageData) return null

      // return a value for the input of the path you passed
      // `user.get` in this case
      return [{ id: index }]
    },
  )

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>
        {data.map((user) => {
          return <p key={user.name}>{user.name}</p>
        })}
      </div>

      <button onClick={() => setSize(size + 1)}>Load More Users</button>
    </>
  )
}
```

## Utility

### matchMutate

The [`matchMutate`](https://swr.vercel.app/docs/advanced/cache#mutate-multiple-keys-from-regex) utility allows you to invalidate query keys that match a tRPC route. Create your typed `useMutateMutate` function:

```ts
// trpc.ts
import { createSWRHooks, getUseMatchMutate } from 'trpc-swr'
// `import type` ensures this import is fully erased at runtime
import type { AppRouter } from './router'

export const trpc = createSWRHooks<AppRouter>()
export const useMatchMutate = getUseMatchMutate<AppRouter>()
```

Now use it in a component:

```ts
import { trpc, useMatchMutate } from './trpc'

// profiles.tsx
const Profiles = () => {
  const userBobData = trpc.useSWR([
    'user.get',
    {
      name: 'Bob',
    },
  ])

  const userAvaData = trpc.useSWR([
    'user.get',
    {
      name: 'Ava',
    },
  ])

  const matchMutate = useMatchMutate()

  return (
    <div>
      {[userBobData, userAvaData].map(({ data: user, isValidating }) => (
        <div>
          Name: {!data && isValidating
            ? 'loading...'
            : data
            ? data.name
            : 'User does not exist'}
        </div>
      ))}
      <button onClick={() => matchMutate('user.get')}>
        Revalidate all tRPC `user.get` queries
      </button>
    </div>
  )
}
```

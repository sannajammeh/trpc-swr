[![CI](https://github.com/sannajammeh/trpc-swr/actions/workflows/ci.yml/badge.svg)](https://github.com/sannajammeh/trpc-swr/actions/workflows/ci.yml)

![trpc-swr](assets/banner.png)

# trpc-swr

[tRPC](https://trpc.io/)-ified [SWR](https://swr.vercel.app/) hooks

This is a monorepo for tRPC-SWR.

## Links

| Description            | Link                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| client                 | https://github.com/sannajammeh/trpc-swr/tree/main/packages/client   |
| next                   | https://github.com/sannajammeh/trpc-swr/tree/main/packages/next     |
| ssr                    | https://github.com/sannajammeh/trpc-swr/tree/main/packages/ssr      |
| infinite               | https://github.com/sannajammeh/trpc-swr/tree/main/packages/infinite |
| Production E2E Results | https://sannajammeh.github.io/trpc-swr/playwright-report/           |

## Installation

```sh
npm install @trpc-swr/client
# Peer deps
npm install swr @trpc/client @trpc/server
```

## Usage

First, create your fully typed hooks using your router type:

```ts
// trpc.ts
import { createSWRProxyHooks } from "@trpc-swr/client";
// `import type` ensures this import is fully erased at runtime
import type { AppRouter } from "./server/router";

// Pass the tRPC configuration object in here
// note that you should pass data transformers (https://trpc.io/docs/data-transformers) here
export const trpc = createSWRProxyHooks<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});
```

Then, add the `trpc.Provider` to your root `App` component:

```tsx
// _app.tsx
import { createTRPCClient } from "@trpc/client";
import { trpc } from "../utils/trpc";

const App = ({ pageProps }) => {
  // create a tRPC vanilla client
  const [client] = useState(() => trpc.createClient());

  return (
    <trpc.Provider client={client}>
      <Component {...pageProps} />
    </trpc.Provider>
  );
};
```

> Tip: For [SWR's global configuration](https://swr.vercel.app/docs/global-configuration), wrap this provider with `SWRConfig`.

### useSWR

Now use `trpc` to query in a component:

```tsx
// profile.tsx
import { trpc } from "./trpc";

const Profile = (props: { userId: string }) => {
  const { data, isLoading } = trpc.user.get.useSWR({ id: props.userId });

  return (
    <div>
      Name:{" "}
      {!data && isLoading
        ? "loading..."
        : data
          ? data.name
          : "User does not exist"}
    </div>
  );
};
```

`trpc.useSWR` functions the same and accepts all the options that SWR's [`useSWR`](https://swr.vercel.app/docs/options#options) hook does. It is only a very small wrapper that adds tRPC types and creates a fetcher using tRPC's vanilla client.

### Mutations

You can use `trpc.useSWRMutation` api to get a tRPC client for mutations:

```tsx
// profile.tsx
import { trpc } from "./trpc";

const Profile = (props: { userId: string }) => {
  // get `mutate` from trpc.useSWR
  // this is a bound mutate (https://swr.vercel.app/docs/mutation#bound-mutate)
  const { data, mutate, isLoading } = trpc.user.get.useSWR({
    id: props.userId,
  });

  const { trigger } = trpc.user.changeName.useSWRMutation();

  return (
    <div>
      <div>
        Name:{" "}
        {!data && isLoading
          ? "loading..."
          : data
            ? data.name
            : "User does not exist"}
      </div>

      <button
        onClick={() => {
          // you would typically get this from user input
          // but it is hardcoded here to simplify the example
          const newName = "Jack";

          // `mutate` revalidates the `user.get` key above
          // so it is refetched after the mutation is complete
          mutate(
            () => {
              return trigger({
                id: props.userId,
                newName,
              });
            }, // use optimisticData to show new name before mutation completes
            { optimisticData: { name: newName } }
          );
        }}
      ></button>
    </div>
  );
};
```

### Preloading data

This is useful for kicking off a request early when you know you'll need the data soon.

```tsx
// UserList.tsx

const UserList = () => {
  const { data: users } = trpc.user.getAll.useSWR();

  const handleHover = (id: number) => {
    // Preload the data once the user hovers
    // This makes sure we have the user object in SWR cache when the user clicks the link
    trpc.user.get.preload({ id });
  };

  return (
    <ul>
      {users.map((user) => (
        <li onHover={() => handleHover(user.id)} key={user.id}>
          <Link href={`/users/${user.id}`}>
            <a>{user.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};
```

### SSG & SSR

To prefetch data on the server, you must provide a serializable key.

In `server/ssg.ts`

```tsx
import { createSSRHelpers } from "@trpc-swr/ssr";

export const createSSG = () => {
  return createSSRHelpers({
    router: appRouter,
    ctx: {},
  });
};
```

```tsx
import { createSSG } from "server/ssg";

const HomePage: NextPage = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <h1>Home</h1>
      <Profile userId="1" />
    </SWRConfig>
  );
};

const Profile = (props: { userId: string }) => {
  // The data is already available in the UI
  const { data } = trpc.user.get.useSWR({
    id: props.userId,
  });

  return (
    <div>
      Name: {data!.name}
    </div>
  );
};

export const getServerSideProps = async () => {
  const ssg = createSSG();

  ssg.user.get({ id: "1" }); // prefetch data

  return {
    props: {
      fallback: await ssg.dehydrate(), // Dehydrate the data into SWR cache
    },
  };
};

export defualt HomePage;
```

## Status

[Live E2E Status](https://sannajammeh.github.io/trpc-swr/playwright-report/)

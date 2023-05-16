# @trpc-swr/next

[tRPC](https://trpc.io/)-ified [SWR](https://swr.vercel.app/) hooks

A Next.js helper library for using SWR with tRPC (pages dir).

Documentation: https://trpc-swr.vercel.app/server-side/setup#using-nextjs

## Usage

If you're using Next.js, you can use the `withTRPCSWR` helper function. Then in your pages you must return the `swr` props from `getServerSideProps` or `getStaticProps`.

In `pages/_app.tsx`

```tsx
import { withTRPCSWR } from "@trpc-swr/next";

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withTRPCSWR({})(MyApp);
```

In a page

```tsx
import { createSSG } from "server/ssg";

export default function Page() {
  const { data } = trpc.users.byId.useSWR({ id: 1 });

  return <div>{data!.name}</div>; // data is always defined since it's fetched on the server
}

export const getServerSideProps = () => {
    const trpc = createSSG();

    // You can await this function if you want to wait for the data to be fetched. It's not necessary though.
    trpc.users.byId.fetch({ id: 1 });
    return {
        props: {
            swr: await trpc.dehydrate();
        }
    }
}
```

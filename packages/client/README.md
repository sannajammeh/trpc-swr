# trpc-swr

[tRPC](https://trpc.io/)-ified [SWR](https://swr.vercel.app/) hooks

Documentation: https://trpc-swr.vercel.app/

## Installation

```sh
npm install @trpc-swr/client
# Peer deps
npm install swr @trpc/client @trpc/server
```

## Usage

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

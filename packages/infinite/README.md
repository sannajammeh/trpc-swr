# @trpc-swr/infinite

[tRPC](https://trpc.io/)-ified [SWR](https://swr.vercel.app/) hooks

Documentation: https://trpc-swr.vercel.app/infinite-queries

```tsx
// profile.tsx
const { data, error, size, setSize } = infinite.user.getMany.useCursor(
  { limit: 3 },
  (index, previousPageData) => {
    return previousPageData?.nextCursor;
  }
);

const users = data?.pages.flat() || [];
const hasMore = data?.at(-1).nextCursor !== null;

return (
  <div>
    {users.map((user) => (
      <div key={user.id}>{user.name}</div>
    ))}
    {hasMore && (
      <button
        onClick={() => {
          setSize(size + 1);
        }}
      >
        Load more
      </button>
    )}
  </div>
);
```

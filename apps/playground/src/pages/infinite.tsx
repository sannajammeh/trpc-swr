import React from "react";
import { infinite } from "../utils/trpc";

const Infinite = () => {
  return (
    <div>
      <h1>Infinite</h1>
      <UsingPage />
      <UsingCursor />
    </div>
  );
};

export default Infinite;

const UsingPage = () => {
  const { data, setSize } = infinite.user.getMany.use(
    (index, previousPageData) => {
      if (index !== 0 && !previousPageData?.hasMore) return null;
      return { limit: 3, page: index };
    }
  );

  const mergedData = data?.flatMap((page) => page.data) ?? [];
  const hasMore = data?.at(-1)?.hasMore;

  return (
    <section>
      <h2>With page size</h2>
      <p>
        This requires manually configuring the stop points (when we have no more
        data). <br />
        Useful for custom solutions not using cursor.
      </p>
      <div>
        {mergedData?.map((user) => {
          return (
            <div key={user.id}>
              {user.id + 1}. {user.name}
            </div>
          );
        })}
        {hasMore && (
          <button onClick={() => setSize((s) => s + 1)}>Load more</button>
        )}
      </div>
    </section>
  );
};

const UsingCursor = () => {
  const { data, setSize } = infinite.user.getManyCursor.useCursor(
    { limit: 3 },
    (data) => data?.nextCursor
  );

  const mergedData = data?.flatMap((page) => page.data) ?? [];
  const hasMore = data?.at(-1)?.nextCursor;

  return (
    <section>
      <h2>With cursor</h2>
      <p>
        This simply requires the endpoint to support cursor pagination. <br />
        Uses the cursor to determine when to stop & fetch more data. Useful for
        working with Prisma.
      </p>
      <div>
        {mergedData?.map((user) => {
          return (
            <div key={user.id}>
              {user.id + 1}. {user.name}
            </div>
          );
        })}
        {hasMore && (
          <button onClick={() => setSize((s) => s + 1)}>Load more</button>
        )}
      </div>
    </section>
  );
};

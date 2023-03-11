import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

trpc.user.byId.preload({ id: 1 });

const Home: NextPage = () => {
  const { data, mutate, isValidating } = trpc.user.byId.useSWR({ id: 2 });
  const { data: user1, isLoading } = trpc.user.byId.useSWR({ id: 1 });
  const ctx = trpc.useContext();
  console.log("🚀 ~ file: index.tsx:10 ~ ctx:", ctx);

  const { data: userData } = trpc.user.get.useSWR();
  return (
    <>
      <div>
        Name:{" "}
        {!data && isValidating
          ? "loading..."
          : data
          ? data.name
          : "User does not exist"}
      </div>

      <button
        onClick={async () => {
          mutate(
            () => {
              return (client as any).mutation("user.create", { name: "trpc2" });
            },
            { optimisticData: { name: "trpc2" } }
          );
        }}
      >
        Post Name
      </button>

      <h2>User with id 1 -{">"} preloaded</h2>

      <div>
        Name:{" "}
        {!user1 && isLoading
          ? "loading..."
          : user1
          ? user1.name
          : "User does not exist"}
      </div>
      <h3>Users</h3>

      {userData?.map((user) => {
        if (!user) return;
        return (
          <div key={user?.name}>
            {user?.name ? `Name: ${user.name}` : "loading..."}
          </div>
        );
      })}
    </>
  );
};

export default Home;

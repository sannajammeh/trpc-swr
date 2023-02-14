"use client";

import { trpc } from "../../utils/trpc";

const User = () => {
  const { data } = trpc.user.byId.useSWR({ id: 1 });
  console.assert(data?.name !== undefined, "data should be defined");
  //   console.log(config.fallback);
  return <div>{data?.name}</div>;
};

export default User;

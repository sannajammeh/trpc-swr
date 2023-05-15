import { api } from "@/lib/trpc";
import { nextApi } from "@/lib/trpc-next";
import { createSSG } from "@/server/_app";
import { GetStaticProps, NextPage } from "next";
import React from "react";

const WithNext = () => {
  const { data } = api.hello.useSWR({ name: "with-next" });
  if (!data) throw new Error("No data");
  return (
    <div>
      <span data-testid="with-next">{data?.hello}</span>
    </div>
  );
};

const FakeApp = nextApi.withTRPC(WithNext);

const Page: NextPage = (props) => {
  return (
    <FakeApp
      {...props}
      pageProps={{
        swr: (props as any).swr,
      }}
    />
  );
};

export default Page;

export const getStaticProps: GetStaticProps = async () => {
  const ssg = await createSSG();

  await ssg.hello.fetch({ name: "with-next" });

  return {
    props: {
      swr: await ssg.dehydrate(),
    },
  };
};

import Sidebar from "@/components/Sidebar";
import { api } from "@/lib/trpc";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PropsWithChildren, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>TRPC-SWR Demo</title>
      </Head>
      <ApplyTrpcProvider>
        <div className="grid grid-cols-[1fr,_4fr] h-screen">
          <Sidebar />
          <main className="overflow-y-auto min-h-full p-16 px-32">
            <Component {...pageProps} />
          </main>
        </div>
      </ApplyTrpcProvider>
    </>
  );
}

const ApplyTrpcProvider = ({ children }: PropsWithChildren<{}>) => {
  const [client] = useState(() => api.createClient());

  const router = useRouter();

  // Do not apply the provider for with-next as it uses a different trpc client
  if (router.pathname.startsWith("/with-next")) {
    return <>{children}</>;
  }

  return <api.Provider client={client}>{children}</api.Provider>;
};
